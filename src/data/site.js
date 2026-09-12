import {
  Code2,
  Cpu,
  Clapperboard,
  Image as ImageIcon,
  Shield,
  GraduationCap,
} from 'lucide-react';

export const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
];

export const stats = [
  { value: '2+', label: 'Projects Done' },
  { value: '100%', label: 'Client Joy' },
  { value: '48h', label: 'Avg. Response' },
  { value: '24/7', label: 'Support' },
];

export const services = [
  {
    id: 'web',
    icon: Code2,
    title: 'Web Development',
    body: 'High-performance, SEO-ready websites designed to convert visitors into customers.',
    wide: true,
    aside: 'terminal',
    delay: 100,
  },
  {
    id: 'software',
    icon: Cpu,
    title: 'Software Solutions',
    body: 'Custom business tools, automated workflows, and internal dashboards tailored to your needs.',
    delay: 200,
  },
  {
    id: 'video',
    icon: Clapperboard,
    title: 'Video Editing',
    body: 'Professional editing for social media, ads, and corporate presentations that tell your story.',
    delay: 300,
  },
  {
    id: 'design',
    icon: ImageIcon,
    title: 'Posters & Banners',
    body: 'On-brand social posts, banners, and print-ready posters designed to match your site and identity.',
    wide: true,
    aside: 'swatches',
    delay: 400,
  },
];

export const packages = [
  {
    id: 'lite',
    name: 'Launch Lite',
    price: '₹1,500',
    priceNote: 'to ₹3k',
    features: ['Single-page layout', 'Mobile responsive', 'Basic SEO setup'],
    cta: 'Inquire',
    featured: false,
    delay: 0,
  },
  {
    id: 'pro',
    name: 'Pro Vision',
    price: '₹5,000',
    priceNote: 'to ₹9k',
    features: ['Up to 5 custom pages', 'Premium layout', 'Content management'],
    cta: 'Get Started',
    featured: true,
    delay: 100,
  },
  {
    id: 'brand',
    name: 'Brand Builder',
    price: '₹9,000',
    priceNote: 'to ₹15k',
    features: ['Up to 8 tailored pages', 'Dynamic animations', 'Database integration'],
    cta: 'Inquire',
    featured: false,
    delay: 200,
  },
  {
    id: 'commerce',
    name: 'Commerce',
    price: '₹18,000+',
    priceNote: null,
    features: ['E-shop & cart', 'Payment gateway', 'Inventory panel'],
    cta: 'Go Live',
    featured: false,
    delay: 300,
  },
];

export const works = [
  {
    id: 'rr',
    title: 'RR Enterprises',
    chip: 'Business Website',
    chipClass: 'bg-emerald-700',
    icon: Shield,
    iconClass: 'text-emerald-400',
    coverClass: 'bg-gradient-to-br from-slate-800 to-slate-950',
    body: 'A CCTV & security solutions company website with services, products, and brand partners showcased for a Chennai-based security systems provider.',
    meta: 'Security & Surveillance',
    href: 'https://guruprasath777.github.io/rrenterprises.github.io/index.html',
    delay: 100,
  },
  {
    id: 'stem',
    title: 'Stem Society – ANC',
    chip: 'Community Site',
    chipClass: 'bg-blue-600',
    icon: GraduationCap,
    iconClass: 'text-emerald-300',
    coverClass: 'bg-gradient-to-br from-emerald-700 to-emerald-950',
    body: "A dedicated community platform for Stem Society's ANC chapter, built to showcase events, activities, and member engagement.",
    meta: 'Community Platform',
    href: 'https://guruprasath777.github.io/STEMSOCIETY1/index.html',
    delay: 200,
  },
  {
    id: 'naturals',
    title: 'Naturals',
    chip: 'Graphic Design',
    chipClass: 'bg-purple-600',
    icon: ImageIcon,
    iconClass: 'text-white',
    coverClass: 'bg-gradient-to-br from-emerald-500 to-emerald-800',
    body: 'On-brand promotional posters designed for Naturals: social and in-store creatives built for visual impact and brand consistency.',
    meta: 'Poster & Print Design',
    href: null,
    hrefLabel: 'Design Work',
    delay: 300,
  },
];

export const faqs = [
  {
    q: 'Will my website be mobile-friendly?',
    a: 'Absolutely. Every project we build at Serenyx is "Mobile-First," meaning it will look perfect on smartphones, tablets, and desktops.',
    delay: 0,
  },
  {
    q: 'Do you provide maintenance?',
    a: 'Yes, we provide 3 months of free technical support for all "Pro" and "Brand" packages to ensure everything runs smoothly.',
    delay: 100,
  },
];

export const contact = {
  email: 'contact.serenyx@gmail.com',
  phone: '+91 73058 83633',
  phoneHref: 'tel:+917305883633',
  whatsapp: 'https://wa.me/917305883633',
  location: 'Remote, India',
};

export const packageOptions = [
  'Launch Lite',
  'Pro Vision',
  'Brand Builder',
  'Commerce Catalyst',
];
