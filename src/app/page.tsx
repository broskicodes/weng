import Link from 'next/link';
import { Project } from '@/utils/types';

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
          I'm a self-taught <span className="font-bold text-primary">Electronics Engineer</span> <span className="italic text-gray-400">(in training)</span>
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
                <img 
                  src={project.image ?? '/images/placeholder.png'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span className="font-medium">YouTube</span>
          </a>
          <a 
            href="https://twitter.com/braedenhall_"
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span className="font-medium">Twitter</span>
          </a>
          <a 
            href="mailto:braeden@brhall.dev" 
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/20 hover:bg-primary/5 transition-all"
          >
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>
            <span className="font-medium">Email</span>
          </a>
        </div>
      </section>
    </main>
  );
}
