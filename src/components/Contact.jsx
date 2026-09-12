import { useState } from 'react';
import { Mail } from 'lucide-react';
import { contact, packageOptions } from '../data/site.js';

const FIELD =
  'w-full p-4 rounded-xl border-emerald-200 border outline-none focus:ring-2 focus:ring-emerald-600 transition';
const LABEL = 'block text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2';

/**
 * There is no backend. The static version silently reloaded the page and threw
 * the message away; in a SPA that would blank the whole app, so submit is
 * intercepted and handed to the visitor's mail client pre-filled.
 *
 * This is a stopgap, not a solution — it needs a configured mail client and
 * gives no delivery guarantee. Replace with Formspree / Netlify Forms / a small
 * API route when there's somewhere to POST to.
 */
export default function Contact() {
  const [status, setStatus] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const pkg = (data.get('package') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    const subject = `Website inquiry${pkg ? ` — ${pkg}` : ''}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      pkg ? `Package: ${pkg}` : null,
      '',
      message,
    ]
      .filter((l) => l !== null)
      .join('\n');

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatus(
      `Opening your email app with the message pre-filled. If nothing happens, write to ${contact.email} directly.`
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div
          className="bg-emerald-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 border border-emerald-100"
          data-aos="zoom-in-up"
        >
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="text-4xl font-bold text-emerald-900 mb-6">Let&apos;s Talk!</h2>
            <p className="text-emerald-800 mb-8">
              Ready to bring your vision to life? Fill out the form or reach out via email.
            </p>
            <p className="font-bold text-emerald-900 flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:underline break-all">
                {contact.email}
              </a>
            </p>
          </div>

          <div className="md:w-2/3">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="cf-name" className={LABEL}>
                  Name
                </label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Virat Kohli"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="cf-email" className={LABEL}>
                  Email
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="virat@company.in"
                  className={FIELD}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-package" className={LABEL}>
                  Package
                </label>
                <select id="cf-package" name="package" className={`${FIELD} bg-white`} defaultValue="">
                  <option value="">Select Package</option>
                  {packageOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-message" className={LABEL}>
                  Your Message
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows="4"
                  required
                  aria-describedby="cf-help"
                  placeholder="A short line about what you are building and your rough timeline."
                  className={FIELD}
                />
                <p id="cf-help" className="mt-2 text-xs text-emerald-800">
                  We reply within 48 hours, Monday to Saturday.
                </p>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition shadow-lg"
              >
                Send Inquiry
              </button>

              <p
                role="status"
                aria-live="polite"
                className="sm:col-span-2 text-sm text-emerald-900 min-h-[1.25rem]"
              >
                {status}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
