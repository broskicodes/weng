import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Project } from '@/utils/types';
import { MediaDisplay } from '@/components/MediaDisplay';
import { getMediaUrl } from '@/utils/aws';

// async function getProject(slug: string): Promise<Project | null> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}`);
//   if (!res.ok) {
//     if (res.status === 404) return null;
//     throw new Error('Failed to fetch project');
//   }
//   return res.json();
// }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project | null = {
    id: "1",
    title: "Project 1",
    description: "Description 1",
    mediaKey: "mediaKey1",
    slug: "project-1",
    purchaseLink: "https://example.com/project-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  if (!project) {
    notFound();
  }

  const projectLinks = {
    diy: `/projects/${project.slug}/diy`,
    progress: `/projects/${project.slug}/progress`,
    purchase: project.purchaseLink || null
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-8">
      <Link 
        href="/"
        className={buttonVariants({ variant: "ghost" })}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </Link>
      
      <article className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-space font-bold">{project.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{project.description}</p>
        </div>

        <div className="aspect-video rounded-xl overflow-hidden">
          <MediaDisplay 
            src={getMediaUrl(project.mediaKey)}
            alt={project.title}
            className="w-full h-full object-cover"
            minimalControls
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={projectLinks.diy}
            className="group flex flex-col items-center p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-4 mb-4 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">DIY Walkthrough</h3>
            <p className="text-gray-600 text-center">Step-by-step guide to build this project</p>
          </Link>

          <Link
            href={projectLinks.progress}
            className="group flex flex-col items-center p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-4 mb-4 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-colors">
              <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Timeline</h3>
            <p className="text-gray-600 text-center">Latest updates and development status</p>
          </Link>

          <Link
            href={projectLinks.purchase || '#'}
            target="_blank"
            className={`group flex flex-col items-center p-6 rounded-xl transition-all ${
              projectLinks.purchase 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white hover:shadow-lg hover:-translate-y-1"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className={`p-4 mb-4 rounded-full transition-colors ${
              projectLinks.purchase ? "bg-white/10 group-hover:bg-white/20" : "bg-gray-200"
            }`}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Just Buy It</h3>
            <p className={`text-center ${projectLinks.purchase ? "text-white/80" : "text-gray-400"}`}>
              {projectLinks.purchase ? "If you're too lazy to build it yourself" : "Not available for purchase"}
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
} 