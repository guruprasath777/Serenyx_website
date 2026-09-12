import { useEffect, useRef, useState } from 'react';
import { createSerenyxScenes } from '../three/serenyx-three.js';

/**
 * Owns the WebGL layer's lifetime.
 *
 * The Three.js module is imperative by design — it manages its own renderers,
 * observers and frame loop — so React's job here is only to hand it the two
 * canvases and to tear it down again. StrictMode mounts effects twice in dev,
 * which is exactly why createSerenyxScenes() keeps a per-mount registry and
 * returns a real disposer; without that the first mount's WebGL contexts would
 * leak and the browser would eventually refuse to create new ones.
 */
export default function useSerenyxScenes() {
  const heroCanvasRef = useRef(null);
  const pricingCanvasRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const scenes = createSerenyxScenes({
      heroCanvas: heroCanvasRef.current,
      pricingCanvas: pricingCanvasRef.current,
      onHintDismiss: () => setHintVisible(false),
    });

    setSupported(scenes.supported);
    return () => scenes.dispose();
  }, []);

  return { heroCanvasRef, pricingCanvasRef, hintVisible, supported };
}
