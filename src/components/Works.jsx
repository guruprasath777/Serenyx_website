import { ArrowRight } from 'lucide-react';
import { works } from '../data/site.js';

function WorkCard({ work }) {
  const Icon = work.icon;

  return (
    <div
      className="group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      data-aos="fade-up"
      data-aos-delay={work.delay}
    >
      <div className={`relative h-64 overflow-hidden ${work.coverClass} flex items-center justify-center`}>
        <Icon
          className={`w-20 h-20 ${work.iconClass} opacity-90 transition-transform duration-700 group-hover:scale-110`}
          aria-hidden="true"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`${work.chipClass} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg`}
          >
            {work.chip}
          </span>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
          {work.title}
        </h3>
        <p className="text-slate-600 mt-3 text-sm leading-relaxed">{work.body}</p>

        <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
            {work.meta}
          </span>
          {work.href ? (
            <a
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold text-sm flex items-center group/btn"
            >
              View Project
              <ArrowRight
                className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          ) : (
            <span className="text-slate-600 font-bold text-sm">{work.hrefLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section id="works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Crafting Digital Excellence
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore how we&apos;ve helped startups and businesses scale with precision-engineered
            digital solutions.
          </p>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {works.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
