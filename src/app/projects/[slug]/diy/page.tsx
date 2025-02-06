import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Project } from '@/utils/types';

async function getProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch project');
  }
  return res.json();
}

export default async function ProjectDIYPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }

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
            Build your own {project.title}
          </h1>
          <p className="text-lg text-gray-600">
            Follow this step-by-step guide to build this project from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-space font-bold">Required Tools</h2>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Soldering Iron</li>
                  <li>Wire Cutters</li>
                  <li>Multimeter</li>
                  <li>Basic Hand Tools</li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-space font-bold">Components</h2>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Component list coming soon...</li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-space font-bold">Assembly Steps</h2>
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">Getting Started</h3>
                  </div>
                  <p className="text-gray-600">
                    Instructions coming soon...
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-semibold">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Difficulty</h4>
                    <p className="text-primary font-medium">Intermediate</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Time Required</h4>
                    <p className="font-medium">2-3 hours</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cost</h4>
                    <p className="font-medium">~$50</p>
                  </div>
                </div>
                {project.purchaseLink && (
                  <Link
                    href={project.purchaseLink}
                    className="block w-full text-center bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Buy Pre-Built
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