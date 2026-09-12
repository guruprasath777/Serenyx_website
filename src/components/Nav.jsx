import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { navLinks } from '../data/site.js';
import eagle from '../../Asserts/web/serenyx-eagle.png';
import wordmark from '../../Asserts/web/serenyx-wordmark.png';

export default function Nav() {
  const [shrunk, setShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="main-nav"
      className={`fixed w-full z-50 glass border-b border-emerald-100 h-20${shrunk ? ' nav-shrunk' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <a href="#home" className="flex items-center group" aria-label="Serenyx home">
            <img
              src={eagle}
              alt=""
              className="h-10 md:h-12 w-auto object-contain mr-3 transition-transform group-hover:scale-110"
            />
            <span className="flex flex-col">
              <img src={wordmark} alt="SERENYX" className="h-6 md:h-8 w-auto object-contain" />
              <span className="text-[6px] md:text-[8px] tracking-[0.4em] uppercase font-bold text-emerald-700">
                Digital Solutions
              </span>
            </span>
          </a>

          <div className="hidden md:flex space-x-8 font-medium items-center">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-emerald-700 transition">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-800 transition shadow-md"
            >
              Get Started
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-emerald-700 p-1"
          >
            <Menu className="w-7 h-7" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="md:hidden bg-white border-b px-4 py-6 space-y-4 shadow-xl"
      >
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-semibold"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="block w-full text-center bg-emerald-700 text-white py-3 rounded-xl font-bold"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
