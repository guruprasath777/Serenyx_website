import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons.jsx';
import { contact } from '../data/site.js';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <>
      <a
        href={contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Serenyx on WhatsApp"
        className="fixed bottom-24 right-6 z-[60] bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        // Hidden from the tab order while off-screen, so keyboard users don't
        // land on an invisible control.
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        style={{
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0)' : 'translateY(40px)',
        }}
        className="fixed bottom-6 right-6 z-[60] bg-slate-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </>
  );
}
