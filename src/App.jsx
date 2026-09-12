import { useEffect } from 'react';
import AOS from 'aos';

import useSerenyxScenes from './hooks/useSerenyxScenes.js';
import Nav from './components/Nav.jsx';
import FloatingActions from './components/FloatingActions.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Pricing from './components/Pricing.jsx';
import Works from './components/Works.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { heroCanvasRef, pricingCanvasRef, hintVisible, supported } = useSerenyxScenes();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Disabled under reduced motion, which leaves every element in its final
    // readable state rather than stuck at the animation's starting opacity.
    AOS.init({ duration: 1000, once: true, offset: 100, disable: reduce });
    // The sections mount in one pass, but images and the WebGL canvas settle
    // after; refresh so AOS measures the real document height.
    AOS.refresh();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <FloatingActions />
      <Nav />

      <main id="main">
        <Hero canvasRef={heroCanvasRef} hintVisible={hintVisible} webglSupported={supported} />
        <Services />
        <Pricing canvasRef={pricingCanvasRef} webglSupported={supported} />
        <Works />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
