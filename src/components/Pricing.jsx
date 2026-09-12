import { CheckCircle2, Sparkles } from 'lucide-react';
import { packages } from '../data/site.js';

/**
 * Contrast note: on the emerald-900 band a darker button would sink into the
 * card (emerald-700 on emerald-900 is only 1.77:1), so the non-featured CTAs
 * keep the bright emerald-500 surface and take a near-black label instead
 * (emerald-950 on emerald-500 = 5.97:1). Don't "fix" this to white text.
 */
function PackageCard({ pkg }) {
  if (pkg.featured) {
    return (
      <div
        className="bg-white p-8 rounded-3xl border-4 border-emerald-400 md:scale-105 text-slate-900 relative shadow-2xl"
        data-aos="zoom-in"
        data-aos-delay={pkg.delay}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white pl-3 pr-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3" aria-hidden="true" /> Most Popular
        </div>
        <h3 className="text-xl font-bold text-emerald-800">{pkg.name}</h3>
        <div className="text-3xl font-bold my-4">
          {pkg.price}{' '}
          {pkg.priceNote && <span className="text-sm font-normal text-slate-500">{pkg.priceNote}</span>}
        </div>
        <ul className="space-y-4 mb-8 text-sm">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" /> {f}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="block w-full text-center py-3 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-bold transition"
        >
          {pkg.cta}
        </a>
      </div>
    );
  }

  const isPrimary = pkg.id === 'lite';

  return (
    <div
      className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-emerald-400 hover:-translate-y-1 transition-all"
      data-aos="zoom-in"
      data-aos-delay={pkg.delay}
    >
      <h3 className="text-xl font-bold text-emerald-300">{pkg.name}</h3>
      <div className="text-3xl font-bold my-4">
        {pkg.price}{' '}
        {pkg.priceNote && <span className="text-sm font-normal text-slate-300">{pkg.priceNote}</span>}
      </div>
      <ul className="space-y-4 mb-8 text-sm opacity-80">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" /> {f}
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className={
          isPrimary
            ? 'block w-full text-center py-3 bg-emerald-500 text-emerald-950 rounded-xl hover:bg-emerald-400 font-bold transition'
            : 'block w-full text-center py-3 bg-white/20 rounded-xl hover:bg-white/30 font-bold transition border border-white/50'
        }
      >
        {pkg.cta}
      </a>
    </div>
  );
}

export default function Pricing({ canvasRef, webglSupported }) {
  return (
    <section id="pricing" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
      {/* Live WebGL signal grid - driven by src/three/serenyx-three.js */}
      <canvas
        id="pricing-canvas"
        ref={canvasRef}
        aria-hidden="true"
        hidden={!webglSupported}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
      />
      <div className="orb w-[32rem] h-[32rem] bg-emerald-500/10 -bottom-40 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Website Packages</h2>
          <p className="text-emerald-300">Affordable pricing for early-stage partners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
