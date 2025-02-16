import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Project } from '@/utils/types';
import DevDetailsForm from '@/components/diy/DevDetailsForm';
import { Toaster } from 'sonner';
import Editor from '@/components/diy/Editor';

async function getProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}?include=details`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch project');
  }
  return res.json();
}

export default async function ProjectDIYPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    notFound();
  }

  if (!project.details) {
    return (
      <main className="container mx-auto px-6 py-16 space-y-8">
        <Toaster />
        <div className="flex items-center justify-between gap-4">
          <Link 
            href={`/projects/${project.slug}`}
            className={buttonVariants({ variant: "ghost" })}
          >
            <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Create DIY Guide</h2>
              <DevDetailsForm slug={project.slug} />
            </div>
          )}

          <div className="md:col-span-3 text-center">
            <h2 className="text-2xl font-bold">DIY Guide Coming Soon</h2>
            <p className="text-gray-600 mt-2">The build guide for this project is still being written.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-16 space-y-8">
      <Toaster />
      <div className="flex items-center justify-between gap-4">
        <Link 
          href={`/projects/${project.slug}`}
          className={buttonVariants({ variant: "ghost" })}
        >
          <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        <Editor 
          slug={project.slug} 
          details={project.details} 
          preview={process.env.NODE_ENV !== 'development'}
          projectDetails={
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg text-gray-900">Project Details</h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Difficulty</h4>
                    <p className="text-primary font-medium capitalize text-lg">{project.details.difficulty}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Cost</h4>
                    <p className="font-medium text-gray-900 text-lg">{project.details.cost}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Build Time</h4>
                    <p className="font-medium text-gray-900 text-lg">{project.details.buildTime}</p>
                  </div>
                </div>
                {project.purchaseLink && (
                  <Link
                    href={project.purchaseLink}
                    className="block w-full text-center bg-primary text-white font-medium px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors mt-6"
                  >
                    Buy Pre-Built
                  </Link>
                )}
              </div>
            </div>
          }
        />
      </div>
    </main>
  );
} 