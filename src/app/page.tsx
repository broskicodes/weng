import Link from 'next/link';
import { Project } from '@/utils/types';
import { getMediaUrl } from '@/utils/aws';
import { MediaDisplay } from '@/components/MediaDisplay';

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export default async function Home() {
  const allProjects = await getProjects();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
      <section className="space-y-4">
        <h3 className="text-base font-marker text-primary animate-fade-in">HI!</h3>
        <h1 className="text-5xl font-space leading-tight animate-fade-in [animation-delay:200ms]">
          My name is <span className="font-bold text-primary">Braeden</span>
        </h1>
        <h2 className="text-xl animate-fade-in [animation-delay:400ms]">
          {"I'm a self-taught"} <span className="font-bold text-primary">Mechatronics Engineer</span> <span className="italic text-gray-400">(in training)</span>
        </h2>
      </section>

      <section className="space-y-8 animate-slide-up">
        <h3 className="text-2xl font-space">
          Here are some of my <span className="font-bold text-primary">projects:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allProjects.map((project, index) => (
            <Link 
              key={index}
              href={`/projects/${project.slug}`}
              className="bg-white group border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <MediaDisplay 
                  src={getMediaUrl(project.mediaKey)}
                  alt={project.title}
                  className="size-full object-cover"
                  minimalControls
                  autoPlay
                />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-space font-bold text-xl">{project.title}</h4>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6 animate-slide-up [animation-delay:200ms]">
        <h3 className="text-2xl font-space">
          Want <span className="font-bold text-primary">more</span> from me?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <a 
            href="https://www.youtube.com/@wEngineering0"
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg className="size-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <span className="font-medium">YouTube</span>
          </a>
          <a 
            href="https://twitter.com/braedenhall_"
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg className="size-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span className="font-medium">Twitter</span>
          </a>
          <a 
            href="mailto:braeden@brhall.dev" 
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg className="size-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span className="font-medium">Email</span>
          </a>
        </div>
      </section>
    </main>
  );
}
