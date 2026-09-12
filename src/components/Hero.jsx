import { Sparkles } from 'lucide-react';
import { stats } from '../data/site.js';

export default function Hero({ canvasRef, hintVisible, webglSupported }) {
  // Top padding clears the fixed 80px nav and then adds breathing room: 48px on
  // mobile, 64px from md up. The previous desktop value was 12rem, which left
  // 112px of dead space under the header and made the section top-heavy against
  // its bottom padding. Don't write Tailwind class names in these comments -
  // the content scanner reads file text and will emit the rule for real.
  return (
    <section
      id="home"
      className="relative pt-32 pb-16 md:pt-36 md:pb-32 bg-white px-4 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full dot-grid opacity-[0.1] pointer-events-none" />
      <div className="orb w-96 h-96 bg-emerald-200/40 -top-20 -left-20" />
      <div className="orb w-[28rem] h-[28rem] bg-emerald-100/50 top-10 -right-32" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              data-aos="fade-up"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> MSME-Certified Digital Studio
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight"
              data-aos="fade-up"
            >
              Your Brand Deserves a <br className="hidden md:block" />
              <span className="text-emerald-600">Website That Winks Back</span>
            </h1>

            <p
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Clean code. Modern design. Affordable pricing. Serenyx helps startups and creators
              build a powerful digital presence.
            </p>

            <div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <a
                href="#contact"
                className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 shadow-xl transition-all hover:-translate-y-1"
              >
                Start Your Project
              </a>
              <a
                href="#pricing"
                className="bg-white border-2 border-emerald-100 text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all hover:-translate-y-1"
              >
                View Packages
              </a>
            </div>
          </div>

          {/* Live WebGL brand core - driven by src/three/serenyx-three.js */}
          <div className="relative" data-aos="fade-left" data-aos-delay="150">
            <div id="hero-stage" className="relative w-full h-[300px] sm:h-[380px] lg:h-[540px]">
              <canvas
                id="hero-canvas"
                ref={canvasRef}
                aria-hidden="true"
                hidden={!webglSupported}
                className="absolute inset-0 w-full h-full"
              />
              {webglSupported && (
                <div
                  id="hero-hint"
                  aria-hidden="true"
                  style={{ opacity: hintVisible ? 1 : 0 }}
                  className="hidden lg:inline-flex absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none items-center gap-2 whitespace-nowrap glass border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 msme-badge" /> Live WebGL
                  &mdash; move your cursor
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto pt-10 mt-14 border-t border-emerald-100 items-center"
          data-aos="fade-in"
          data-aos-delay="400"
        >
          <div className="col-span-2 md:col-span-1 flex justify-center">
            <div className="msme-badge bg-white border-2 border-emerald-500 rounded-xl px-4 py-2">
              <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Govt. of India</div>
              <div className="text-xl font-black text-emerald-600 leading-none">MSME</div>
              <div className="text-[8px] font-bold text-slate-600 uppercase mt-1">Certified</div>
            </div>
          </div>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
