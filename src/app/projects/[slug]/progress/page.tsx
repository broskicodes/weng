import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { buttonVariants } from '@/components/ui/button';
import { Project, ProjectUpdate } from '@/utils/types';
import { getMediaUrl } from '@/utils/aws';
import { MediaDisplay } from '@/components/MediaDisplay';
import { AddUpdateDialog } from './AddUpdateDialog';
import { cn } from '@/lib/utils';

async function getProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch project');
  }
  return res.json();
}

async function getProjectUpdates(slug: string): Promise<ProjectUpdate[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}/updates`);
  if (!res.ok) throw new Error('Failed to fetch project updates');
  const updates = await res.json();
  return updates.sort((a: ProjectUpdate, b: ProjectUpdate) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

export default async function ProjectProgressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, updates] = await Promise.all([
    getProject(slug),
    getProjectUpdates(slug),
  ]);
  
  if (!project) {
    notFound();
  }

  const latestUpdate = updates[0];
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-8">
      {isDev && <AddUpdateDialog slug={slug} />}
      
      <div className="flex items-center gap-4">
        <Link 
          href={`/projects/${project.slug}`}
          className={buttonVariants({ variant: "ghost" })}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Project
        </Link>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-space font-bold">
            {project.title} Progress
          </h1>
          <p className="text-lg text-gray-600">
            Follow along with the development and updates of this project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-12">
              <div className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-[30px] before:bottom-0 before:w-[2px] before:bg-gray-200">
                <div className="relative space-y-4">
                  {updates.length > 0 ? (
                    updates.map((update, index) => (
                      <div key={update.id} className="relative">
                        {index === 0 && (
                          <div className="absolute left-[-33px] flex items-center justify-center w-6 h-6 rounded-full bg-primary ring-8 ring-white">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                        {index !== 0 && (
                          <div className="absolute left-[-25px] w-2 h-2 rounded-full bg-gray-300" />
                        )}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex flex-col gap-1">
                            <time className="text-sm">
                              {new Date(update.completedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <div className="prose prose-sm max-w-none font-bold">
                              <ReactMarkdown
                                components={{
                                  a: ({ node, ...props }) => (
                                    <a {...props} className="text-primary font-medium no-underline hover:underline" target="_blank" rel="noopener noreferrer" />
                                  )
                                }}
                              >
                                {update.update}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none text-gray-500">
                            <ReactMarkdown
                              components={{
                                a: ({ node, ...props }) => (
                                  <a {...props} className="text-primary font-medium no-underline hover:underline" target="_blank" rel="noopener noreferrer" />
                                )
                              }}
                            >
                              {update.description}
                            </ReactMarkdown>
                          </div>
                          {update.mediaKey && (
                            <MediaDisplay 
                              src={getMediaUrl(update.mediaKey)}
                              alt={update.update}
                              className="rounded-lg w-full object-cover"
                              minimalControls
                              autoPlay
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center text-gray-500">
                      No updates yet. Check back soon!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-semibold">Project Status</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Current Phase</h4>
                    <p className="text-primary font-medium">
                      {latestUpdate?.update || 'Planning'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="font-medium">
                      {latestUpdate ? new Date(latestUpdate.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No updates yet'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      project.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'hiatus' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </p>
                  </div>
                </div>
                {project.purchaseLink && (
                  <Link
                    href={project.purchaseLink}
                    className={cn(buttonVariants({ variant: "default" }), "w-full")}
                  >
                    {project.status === 'complete' ? 'Buy Now' : 'Pre-Order Now'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 