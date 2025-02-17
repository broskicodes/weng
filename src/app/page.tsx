import Link from 'next/link';
import { Project } from '@/utils/types';
import { getMediaUrl } from '@/utils/aws';
import { MediaDisplay } from '@/components/MediaDisplay';
import CreateProjectDialog from '@/components/CreateProjectDialog';

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, { cache: 'no-store' });
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
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-space">
            Here are some of my <span className="font-bold text-primary">projects:</span>
          </h3>
          {process.env.NODE_ENV === 'development' && (
            <CreateProjectDialog />
          )}
        </div>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#FF0000]">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <span className="font-medium">YouTube</span>
          </a>
          <a 
            href="https://twitter.com/braedenhall_"
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-black">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="font-medium">Twitter</span>
          </a>
          <a 
            href="mailto:braeden@brhall.dev" 
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-gray-600">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 4-10 8L2 4"/>
            </svg>
            <span className="font-medium">Email</span>
          </a>
        </div>
      </section>
    </main>
  );
}
