import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/site.js';

export default function Faq() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={f.delay}
            >
              <summary className="flex justify-between items-center font-bold text-slate-800">
                {f.q}
                <span className="text-emerald-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="mt-4 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
