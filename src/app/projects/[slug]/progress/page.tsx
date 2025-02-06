import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Project, ProjectUpdate } from '@/utils/types';
import { getMediaUrl } from '@/utils/aws';
import { MediaDisplay } from '@/components/MediaDisplay';

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
  return res.json();
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
  const progress = Math.min(Math.floor((updates.length / 10) * 100), 100);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-8">
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
                <div className="relative space-y-12">
                  {updates.length > 0 ? (
                    updates.map((update) => (
                      <div key={update.id} className="relative">
                        <div className="absolute left-[-33px] flex items-center justify-center w-6 h-6 rounded-full bg-primary ring-8 ring-white">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex flex-col gap-1">
                            <time className="text-sm text-gray-500">
                              {new Date(update.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <h3 className="text-xl font-semibold">{update.update}</h3>
                          </div>
                          <p className="text-gray-600">{update.description}</p>
                          {update.media && (
                            <MediaDisplay 
                              src={getMediaUrl(update.media)}
                              alt={update.update}
                              className="rounded-lg w-full aspect-video object-cover"
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
                      {latestUpdate ? new Date(latestUpdate.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No updates yet'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Completion</h4>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{progress}% Complete</p>
                    </div>
                  </div>
                </div>
                {project.purchaseLink && (
                  <Link
                    href={project.purchaseLink}
                    className="block w-full text-center bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Pre-Order Now
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