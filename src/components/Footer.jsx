import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { InstagramIcon, LinkedInIcon, XIcon } from './BrandIcons.jsx';
import { contact } from '../data/site.js';
import eagle from '../../Asserts/web/serenyx-eagle.png';
import wordmark from '../../Asserts/web/serenyx-wordmark.png';

// href is '#' for all three: no social accounts have been supplied yet.
const socials = [
  { name: 'Instagram', href: '#', Icon: InstagramIcon },
  { name: 'LinkedIn', href: '#', Icon: LinkedInIcon },
  { name: 'X (Twitter)', href: '#', Icon: XIcon },
];

const companyLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#works', label: 'Our Portfolio' },
  { href: '#pricing', label: 'Pricing Plans' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start mb-6">
              <img src={eagle} alt="" className="h-10 w-auto mb-3 floating opacity-90" />
              <img
                src={wordmark}
                alt="SERENYX"
                className="h-6 w-auto brightness-0 invert opacity-90"
              />
              <span className="text-[7px] tracking-[0.4em] uppercase font-bold text-emerald-500 mt-2">
                Digital Solutions
              </span>
            </div>

            <div className="flex space-x-4">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={`Serenyx on ${name}`}
                  className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-slate-400 hover:text-emerald-500 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-center md:justify-start text-slate-400">
                <Mail className="w-4 h-4 text-emerald-500 mr-3 shrink-0" aria-hidden="true" />
                {contact.email}
              </li>
              <li className="flex items-center justify-center md:justify-start text-slate-400">
                <Phone className="w-4 h-4 text-emerald-500 mr-3 shrink-0" aria-hidden="true" />
                <a href={contact.phoneHref} className="hover:text-emerald-500 transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500 mr-3 shrink-0" aria-hidden="true" />
                {contact.location}
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end justify-start">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-3">
                <ShieldCheck className="w-7 h-7 text-emerald-500" aria-hidden="true" />
              </div>
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-1">
                Govt. Registered
              </h5>
              <p className="text-[10px] text-slate-400 uppercase leading-tight">
                MSME UDYAM CERTIFIED ENTERPRISE
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} SERENYX. All rights reserved.</p>
          <div className="flex space-x-6 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
