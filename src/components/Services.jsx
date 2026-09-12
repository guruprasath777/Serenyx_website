import { ArrowRight } from 'lucide-react';
import { services } from '../data/site.js';

function Terminal() {
  return (
    <div className="terminal hidden md:block" data-aos="fade-left" data-aos-delay="150">
      <div className="terminal-bar">
        <span className="terminal-dot bg-red-400/70" />
        <span className="terminal-dot bg-yellow-400/70" />
        <span className="terminal-dot bg-emerald-400/70" />
      </div>
      <div className="terminal-body">
        <div>
          <span className="muted">$</span> serenyx build --site
        </div>
        <div>
          <span className="accent">✓</span> optimizing images
        </div>
        <div>
          <span className="accent">✓</span> lighthouse score <span className="accent">98</span>
        </div>
        <div>
          <span className="accent">✓</span> deployed{' '}
          <span className="muted">// 48h avg turnaround</span>
        </div>
      </div>
    </div>
  );
}

function Swatches() {
  return (
    <div className="hidden md:flex flex-col gap-2" data-aos="fade-left" data-aos-delay="450">
      <div className="h-10 rounded-lg bg-emerald-600" />
      <div className="h-10 rounded-lg bg-emerald-300" />
      <div className="h-10 rounded-lg bg-emerald-100 border border-emerald-200" />
      <div className="h-10 rounded-lg bg-white border-2 border-dashed border-emerald-300 flex items-center justify-center text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
        On-brand kit
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;

  const head = (
    <>
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
      <p className="text-slate-600">{service.body}</p>
    </>
  );

  return (
    <div
      className={`bento-card ${service.wide ? 'md:col-span-2 ' : ''}p-8 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all group`}
      data-aos="fade-up"
      data-aos-delay={service.delay}
    >
      {service.wide ? (
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>{head}</div>
          {service.aside === 'terminal' ? <Terminal /> : <Swatches />}
        </div>
      ) : (
        head
      )}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Expertise</h2>
          <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}

          <div
            className="bento-card md:col-span-3 p-8 bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all group"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">
                Not just another vendor. A long-term dev partner.
              </h3>
              <p className="text-emerald-200 text-sm max-w-md">
                We stay on after launch: fixes, updates, and new features as your business grows.
              </p>
            </div>
            <a
              href="#contact"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-emerald-800 px-5 py-3 rounded-xl font-bold hover:-translate-y-0.5 transition-transform"
            >
              Talk to us
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
