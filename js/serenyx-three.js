/* =============================================================================
   Serenyx - 3D UI layer
   -----------------------------------------------------------------------------
   Two WebGL stages, both drawn on transparent canvases so the existing CSS
   background (white hero / emerald-900 pricing) stays the source of truth:

     #hero-canvas     "brand core"  - faceted emerald core + wireframe shell +
                                      instanced orbit nodes (hover-reactive) +
                                      drifting motes. Cursor parallax.
     #pricing-canvas  "signal grid" - additive emerald wave grid on the dark
                                      emerald pricing band.

   Colours are the Tailwind emerald tokens already used across index.html, so
   the 3D reads as the same palette as the rest of the site.
============================================================================= */

import * as THREE from 'three';

/* --- Brand palette (identical hexes to the Tailwind classes in index.html) -- */
const BRAND = {
  emerald950: 0x022c22,
  emerald900: 0x064e3b,
  emerald800: 0x065f46,
  emerald700: 0x047857,
  emerald600: 0x059669,
  emerald500: 0x10b981,
  emerald400: 0x34d399,
  emerald300: 0x6ee7b7,
  emerald200: 0xa7f3d0,
  emerald100: 0xd1fae5,
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

/* --- Soft round sprite for Points (square points look like dead pixels) ----- */
let dotTexture = null;
function getDotTexture() {
  if (dotTexture) return dotTexture;
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  dotTexture = new THREE.CanvasTexture(c);
  dotTexture.colorSpace = THREE.SRGBColorSpace;
  return dotTexture;
}

/* =============================================================================
   Stage - shared plumbing: renderer, camera, sizing, in-view gating, disposal
============================================================================= */
const stages = [];

class Stage {
  constructor(canvas, { fov = 45, position = [0, 0, 7], target = [0, 0, 0] } = {}) {
    this.canvas = canvas;
    this.host = canvas.parentElement || canvas;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 120);
    this.camera.position.set(position[0], position[1], position[2]);
    this.target = new THREE.Vector3(target[0], target[1], target[2]);
    this.camera.lookAt(this.target);
    this.home = this.camera.position.clone();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    // Pointer in -1..1, tracked on window so the scene reacts even while the
    // cursor is over the copy beside it. Canvas-local coords are kept for
    // raycasting (see pointerLocal).
    this.pointer = new THREE.Vector2(0, 0);
    this.pointerLocal = new THREE.Vector2(-2, -2);
    this.pointerInside = false;

    this.raycaster = new THREE.Raycaster();
    this.inView = false;
    this.updaters = [];

    this._onResize = this._resize.bind(this);
    this._ro = new ResizeObserver(this._onResize);
    this._ro.observe(this.host);
    this._resize();

    this._io = new IntersectionObserver(
      (entries) => { this.inView = entries[0].isIntersecting; },
      { rootMargin: '120px' }
    );
    this._io.observe(canvas);

    this._onPointer = (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      const r = canvas.getBoundingClientRect();
      const lx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ly = -((e.clientY - r.top) / r.height) * 2 + 1;
      this.pointerInside = lx >= -1 && lx <= 1 && ly >= -1 && ly <= 1;
      this.pointerLocal.set(lx, ly);
    };
    window.addEventListener('pointermove', this._onPointer, { passive: true });

    stages.push(this);
  }

  _resize() {
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false); // false: never touch the CSS size
    this.render();
  }

  add(fn) { this.updaters.push(fn); }

  render() { this.renderer.render(this.scene, this.camera); }

  tick(elapsed, delta) {
    if (!this.inView) return;
    for (const fn of this.updaters) fn(elapsed, delta, this);
    this.render();
  }

  dispose() {
    this._ro.disconnect();
    this._io.disconnect();
    window.removeEventListener('pointermove', this._onPointer);
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
          m.dispose();
        });
      }
    });
    this.renderer.dispose();
  }
}

/* =============================================================================
   GLSL - shared gradient noise (used by the hero core)
============================================================================= */
const NOISE_GLSL = /* glsl */ `
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
                       dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
                   mix(dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
                       dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
                       dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
                   mix(dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
                       dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
  }
`;

/* =============================================================================
   Scene 1 - hero brand core
============================================================================= */
function buildHero(canvas) {
  const stage = new Stage(canvas, { fov: 42, position: [0, 0, 8.8] });
  const { scene } = stage;

  /* -- lighting: bright key so the emeralds stay true on the white hero ----- */
  scene.add(new THREE.HemisphereLight(0xffffff, BRAND.emerald800, 1.05));
  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(BRAND.emerald400, 26, 26);
  rim.position.set(-4, -2.5, 3.5);
  scene.add(rim);

  const root = new THREE.Group();   // cursor parallax
  const spin = new THREE.Group();   // constant rotation
  root.add(spin);
  scene.add(root);

  /* -- the core: a slowly re-cut emerald.
        Vertices drift on gradient noise; the fragment stage rebuilds a FLAT
        normal from screen-space derivatives, so every triangle reads as its
        own facet — a cut gem rather than a smooth blob.                     -- */
  const coreMat = new THREE.ShaderMaterial({
    extensions: { derivatives: true },
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: 0.24 },
      uDeep: { value: new THREE.Color(BRAND.emerald800) },
      uMid: { value: new THREE.Color(BRAND.emerald500) },
      uRim: { value: new THREE.Color(BRAND.emerald200) },
      uPulse: { value: 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uAmplitude;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      varying float vNoise;
      ${NOISE_GLSL}
      void main() {
        float n = gnoise(normal * 1.7 + vec3(0.0, 0.0, uTime * 0.22));
        vNoise = n;
        vec3 pos = position + normal * n * uAmplitude;
        vec4 world = modelMatrix * vec4(pos, 1.0);
        vPosW = world.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDeep;
      uniform vec3 uMid;
      uniform vec3 uRim;
      uniform float uPulse;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      varying float vNoise;
      void main() {
        vec3 V = normalize(cameraPosition - vPosW);

        // Flat per-triangle normal -> hard facets.
        vec3 N = normalize(cross(dFdx(vPosW), dFdy(vPosW)));
        if (dot(N, V) < 0.0) N = -N;

        vec3 L = normalize(vec3(0.55, 0.85, 0.65));
        float lambert = clamp(dot(N, L), 0.0, 1.0);
        float fres = pow(1.0 - clamp(dot(V, N), 0.0, 1.0), 2.1);
        float band = smoothstep(-0.40, 0.45, vNoise);

        vec3 col = mix(uDeep, uMid, lambert * 0.78 + band * 0.22);
        col = mix(col, uRim, fres * (0.62 + uPulse * 0.28));

        // Blinn highlight picks out individual facets.
        vec3 H = normalize(L + V);
        col += pow(max(dot(N, H), 0.0), 26.0) * 0.45;

        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.72, 4), coreMat);
  spin.add(core);

  /* -- aura: back-faced fresnel shell, a soft emerald halo ------------------ */
  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(2.35, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(BRAND.emerald300) } },
      vertexShader: /* glsl */ `
        varying vec3 vNormalW;
        varying vec3 vPosW;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vPosW = world.xyz;
          vNormalW = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying vec3 vNormalW;
        varying vec3 vPosW;
        void main() {
          vec3 V = normalize(cameraPosition - vPosW);
          float f = pow(clamp(dot(V, normalize(vNormalW)) + 1.0, 0.0, 1.0), 3.0);
          gl_FragColor = vec4(uColor, f * 0.32);
          #include <colorspace_fragment>
        }
      `,
    })
  );
  root.add(aura);

  /* -- wireframe shell, counter-rotating ------------------------------------ */
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.86, 1),
    new THREE.MeshBasicMaterial({
      color: BRAND.emerald400,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
    })
  );
  root.add(shell);

  /* -- orbit ring: instanced nodes, hover-reactive --------------------------- */
  const NODE_COUNT = 48;
  const ring = new THREE.Group();
  ring.rotation.set(THREE.MathUtils.degToRad(64), 0, THREE.MathUtils.degToRad(-16));
  spin.add(ring);

  const nodes = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.13, 0),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.15 }),
    NODE_COUNT
  );
  nodes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(NODE_COUNT * 3), 3);

  const seeds = [];
  const baseColors = [];
  const cA = new THREE.Color(BRAND.emerald600);
  const cB = new THREE.Color(BRAND.emerald300);
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / NODE_COUNT;
    seeds.push({
      angle: t * Math.PI * 2,
      radius: 3.28 + (Math.random() - 0.5) * 0.16,
      lift: (Math.random() - 0.5) * 0.22,
      scale: 0.7 + Math.random() * 0.6,
    });
    const col = cA.clone().lerp(cB, 0.15 + Math.random() * 0.85);
    baseColors.push(col);
    nodes.setColorAt(i, col);
  }
  nodes.instanceColor.needsUpdate = true;

  // Instances are re-placed every frame, so a lazily-computed bound would be
  // whatever frame 1 happened to look like. Author it once, large enough to
  // always contain the ring, and raycasting stays correct.
  nodes.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 3.9);
  ring.add(nodes);

  const dummy = new THREE.Object3D();
  const ndc = new THREE.Vector3();
  const hoverColor = new THREE.Color(BRAND.emerald950);
  const tmpColor = new THREE.Color();
  let hovered = -1;
  const boost = new Float32Array(NODE_COUNT); // eased 0..1 per node

  /* -- motes ---------------------------------------------------------------- */
  const MOTES = 520;
  const motePos = new Float32Array(MOTES * 3);
  for (let i = 0; i < MOTES; i++) {
    const r = 3.0 + Math.random() * 4.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    motePos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    motePos[i * 3 + 1] = r * Math.cos(phi) * 0.7;
    motePos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({
      size: 0.075,
      map: getDotTexture(),
      color: BRAND.emerald400,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  scene.add(motes);

  /* -- per-frame ------------------------------------------------------------ */
  stage.add((elapsed, delta) => {
    coreMat.uniforms.uTime.value = elapsed;

    spin.rotation.y = elapsed * 0.16;
    core.rotation.x = elapsed * 0.09;
    shell.rotation.y = -elapsed * 0.10;
    shell.rotation.x = elapsed * 0.05;
    motes.rotation.y = elapsed * 0.035;
    motes.rotation.x = Math.sin(elapsed * 0.12) * 0.05;

    // hover pick against the instanced ring
    if (stage.pointerInside) {
      stage.raycaster.setFromCamera(stage.pointerLocal, stage.camera);
      const hits = stage.raycaster.intersectObject(nodes, false);
      hovered = hits.length ? hits[0].instanceId : -1;
    } else {
      hovered = -1;
    }
    canvas.style.cursor = hovered >= 0 ? 'pointer' : '';

    const aspect = stage.camera.aspect;
    const lx = stage.pointerLocal.x;
    const ly = stage.pointerLocal.y;

    let anyBoost = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const s = seeds[i];

      // One shared angular speed: the ring stays evenly spaced indefinitely.
      const a = s.angle + elapsed * 0.2;
      dummy.position.set(
        Math.cos(a) * s.radius,
        Math.sin(a) * s.radius,
        s.lift + Math.sin(elapsed * 0.7 + s.angle * 3.0) * 0.10
      );

      // An exact raycast hit lights a node fully; nodes merely NEAR the cursor
      // in screen space glow a little, so the whole ring feels alive without
      // demanding pixel-perfect aim at a 10px target.
      let want = 0;
      if (i === hovered) {
        want = 1;
      } else if (stage.pointerInside) {
        ndc.copy(dummy.position).applyMatrix4(ring.matrixWorld).project(stage.camera);
        const dx = (ndc.x - lx) * aspect;
        const dy = ndc.y - ly;
        want = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.34) * 0.6;
      }
      boost[i] += (want - boost[i]) * Math.min(1, delta * 9);
      anyBoost += boost[i];

      dummy.rotation.set(a * 1.7, a * 1.1, 0);
      dummy.scale.setScalar(s.scale * (1 + boost[i] * 1.9));
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);

      if (boost[i] > 0.001) {
        tmpColor.copy(baseColors[i]).lerp(hoverColor, boost[i] * 0.75);
        nodes.setColorAt(i, tmpColor);
      } else {
        nodes.setColorAt(i, baseColors[i]);
      }
    }
    nodes.instanceMatrix.needsUpdate = true;
    nodes.instanceColor.needsUpdate = true;
    coreMat.uniforms.uPulse.value = Math.min(1, anyBoost);

    // cursor parallax - camera orbits a little, group counter-tilts a little
    const px = stage.pointer.x;
    const py = stage.pointer.y;
    const k = Math.min(1, delta * 2.2);
    stage.camera.position.x += (stage.home.x + px * 1.15 - stage.camera.position.x) * k;
    stage.camera.position.y += (stage.home.y + py * 0.75 - stage.camera.position.y) * k;
    stage.camera.lookAt(stage.target);
    root.rotation.x += (-py * 0.16 - root.rotation.x) * Math.min(1, delta * 2.0);
    root.rotation.z += (px * 0.07 - root.rotation.z) * Math.min(1, delta * 2.0);
  });

  return stage;
}

/* =============================================================================
   Scene 2 - pricing signal grid
============================================================================= */
function buildPricingGrid(canvas) {
  const stage = new Stage(canvas, { fov: 55, position: [0, 2.4, 7.6], target: [0, -0.4, -3] });

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLine: { value: new THREE.Color(BRAND.emerald500) },
      uCrest: { value: new THREE.Color(BRAND.emerald200) },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    extensions: { derivatives: true },
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElev;
      void main() {
        vUv = uv;
        vec3 p = position;
        float w = sin(p.x * 0.52 + uTime * 0.55) * 0.45
                + cos(p.y * 0.68 - uTime * 0.42) * 0.36
                + sin((p.x + p.y) * 0.31 + uTime * 0.75) * 0.22;
        p.z += w;
        vElev = w;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLine;
      uniform vec3 uCrest;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vElev;
      void main() {
        vec2 g = vUv * vec2(52.0, 30.0);
        vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
        float line = 1.0 - min(min(d.x, d.y), 1.0);

        float fade = smoothstep(1.05, 0.20, distance(vUv, vec2(0.5, 0.46)) * 2.0);
        float crest = smoothstep(-0.1, 0.95, vElev);

        vec3 col = mix(uLine, uCrest, crest);
        float a = line * fade * uOpacity * (0.45 + crest * 0.55);
        if (a < 0.004) discard;
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }
    `,
  });

  const grid = new THREE.Mesh(new THREE.PlaneGeometry(34, 20, 130, 78), mat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -1.6;
  stage.scene.add(grid);

  stage.add((elapsed, delta) => {
    mat.uniforms.uTime.value = elapsed;
    mat.uniforms.uOpacity.value = Math.min(0.9, mat.uniforms.uOpacity.value + delta * 0.6);
    grid.rotation.z = Math.sin(elapsed * 0.06) * 0.035;
  });

  return stage;
}

/* =============================================================================
   Boot
============================================================================= */
function boot() {
  const heroCanvas = document.getElementById('hero-canvas');
  const pricingCanvas = document.getElementById('pricing-canvas');
  const hint = document.getElementById('hero-hint');

  if (!supportsWebGL()) {
    [heroCanvas, pricingCanvas].forEach((c) => { if (c) c.remove(); });
    if (hint) hint.remove();
    return;
  }

  if (heroCanvas) buildHero(heroCanvas);
  if (pricingCanvas) buildPricingGrid(pricingCanvas);

  // Reduced motion: draw one settled frame, then stop.
  if (REDUCED_MOTION) {
    stages.forEach((s) => { s.inView = true; s.tick(2.4, 1 / 60); });
    if (hint) hint.remove();
    return;
  }

  const clock = new THREE.Clock();
  let last = 0;
  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const elapsed = clock.getElapsedTime();
    const delta = Math.min(Math.max(elapsed - last, 0), 0.05);
    last = elapsed;
    for (const s of stages) s.tick(elapsed, delta);
  }
  loop();

  // Fade the "it is live" hint out once the visitor has actually moved.
  if (hint) {
    window.addEventListener('pointermove', () => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 700);
    }, { once: true, passive: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
