"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Points,
  BufferGeometry,
  Float32BufferAttribute,
  AdditiveBlending,
  TetrahedronGeometry,
  LineSegments,
  EdgesGeometry,
  LineBasicMaterial,
  Vector2,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// GLSL — monochrome technical backdrop: a curved wall of tiles, faint noise
// illumination, engraved cross markers. Inspired by brutalist studio sites.
// ─────────────────────────────────────────────────────────────────────────────

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;      // normalized -1..1, lerped on CPU
uniform vec2  uResolution;
uniform float uMotion;     // 1 = animated, 0 = static (reduced motion)

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 st = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * uMotion;

  // cylindrical curvature — tiles wrap as if on a curved studio wall
  float curve = st.x * st.x * 0.55;
  vec2 wall = vec2(st.x * (1.0 + curve * 0.6), st.y * (1.0 + curve));
  wall.y += uScroll * 0.55;              // slow parallax with page scroll
  wall.x += t * 0.004;                   // near-imperceptible drift

  // tile grid
  float N = 26.0;
  vec2 cell = wall * N;
  vec2 id   = floor(cell);
  vec2 gv   = fract(cell);

  // grid lines
  float line = max(
    smoothstep(0.045, 0.0, min(gv.x, 1.0 - gv.x)),
    smoothstep(0.045, 0.0, min(gv.y, 1.0 - gv.y)));

  // per-tile uneven illumination, flickering extremely slowly
  float glowN = vnoise(id * 0.35 + vec2(t * 0.02, t * 0.013));
  float tileLum = smoothstep(0.55, 1.0, glowN) * 0.045;

  // engraved cross markers every 6th tile intersection
  vec2 mv = fract(cell / 6.0) * 6.0;
  vec2 cd = abs(mv - 0.0) ;
  float cross6 = 0.0;
  {
    vec2 q = fract(cell / 6.0);
    vec2 d = min(q, 1.0 - q) * 6.0;
    float arm = 0.16;
    float thick = 0.035;
    cross6 = max(
      step(d.x, thick) * step(d.y, arm),
      step(d.y, thick) * step(d.x, arm));
  }

  // mouse — a wide, faint torch on the wall
  vec2  m      = uMouse * vec2(aspect, 1.0) * 0.5;
  float torch  = exp(-length(st - m) * 2.2);

  // large soft illumination pools, breathing very slowly
  float pool = vnoise(st * 1.4 + vec2(0.0, t * 0.015)) * 0.5
             + vnoise(st * 0.6 - vec2(t * 0.01, uScroll * 0.4)) * 0.5;
  pool = smoothstep(0.3, 0.95, pool);

  float lum = 0.0;
  lum += line   * (0.028 + pool * 0.05 + torch * 0.06);
  lum += tileLum * (0.5 + pool);
  lum += cross6 * (0.05 + torch * 0.05);
  lum += pool * 0.012;

  // vignette — darkness pooling at the edges like the reference
  float vig = smoothstep(1.55, 0.25, length(st));
  float topShadow = smoothstep(0.75, 0.2, abs(st.y + 0.15));
  lum *= vig * (0.55 + topShadow * 0.45);

  vec3 col = vec3(0.024) + vec3(lum);

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// crystal facets — monochrome fresnel + moving sheen, flat-shaded
const CRYSTAL_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const CRYSTAL_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fresnel = pow(1.0 - abs(dot(n, v)), 2.2);

  // facet shading — each face catches a different band of "studio light"
  float facet = dot(n, normalize(vec3(0.4, 0.8, 0.45))) * 0.5 + 0.5;
  float sheen = sin(dot(n, vec3(3.0, 5.0, 2.0)) + uTime * 0.35) * 0.5 + 0.5;

  float lum = 0.03 + facet * 0.10 + sheen * 0.05 + fresnel * 0.55;
  gl_FragColor = vec4(vec3(lum), 0.92);
}
`;

// dust — tiny monochrome specks drifting in the dark
const PARTICLE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uMotion;
attribute float aScale;
attribute float aSpeed;
varying float vAlpha;

void main() {
  vec3 pos = position;
  pos.y += sin(uTime * aSpeed + pos.x * 2.0) * 0.15 * uMotion;
  pos.x += cos(uTime * aSpeed * 0.7 + pos.y * 1.5) * 0.10 * uMotion;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (10.0 / -mv.z);
  vAlpha = smoothstep(-9.0, -2.0, mv.z) * 0.20;
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(vec3(0.9), a);
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const refreshRef = useRef<() => void>(() => {});

  // page height changes on route transitions — recompute scroll bounds
  useEffect(() => {
    const id = window.setTimeout(() => refreshRef.current(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL — the CSS gradient fallback stays visible
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motionEnabled = !reducedMotionQuery.matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── background wall quad ──
    const bgScene = new Scene();
    const bgCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime:       { value: 0 },
      uScroll:     { value: 0 },
      uMouse:      { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uMotion:     { value: motionEnabled ? 1 : 0 },
    };
    const quadGeo = new PlaneGeometry(2, 2);
    const quadMat = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    bgScene.add(new Mesh(quadGeo, quadMat));

    // ── foreground: crystal tetrahedron + dust ──
    const fgScene = new Scene();
    const fgCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30);
    fgCamera.position.z = 5;

    const crystalGeo = new TetrahedronGeometry(1.15, 0);
    const crystalMat = new ShaderMaterial({
      vertexShader: CRYSTAL_VERTEX,
      fragmentShader: CRYSTAL_FRAGMENT,
      uniforms: { uTime: uniforms.uTime },
      transparent: true,
    });
    const crystal = new Mesh(crystalGeo, crystalMat);

    const crystalEdges = new EdgesGeometry(crystalGeo);
    const edgeMat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    const edges = new LineSegments(crystalEdges, edgeMat);
    crystal.add(edges);

    crystal.position.set(0, -0.4, -1.2);
    fgScene.add(crystal);

    const COUNT = 90;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -Math.random() * 7 - 1;
      scales[i] = Math.random() * 1.8 + 0.5;
      speeds[i] = Math.random() * 0.4 + 0.1;
    }
    const particleGeo = new BufferGeometry();
    particleGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    particleGeo.setAttribute("aScale", new Float32BufferAttribute(scales, 1));
    particleGeo.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));
    const particleMat = new ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: {
        uTime:       uniforms.uTime,
        uPixelRatio: { value: dpr },
        uMotion:     uniforms.uMotion,
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const particles = new Points(particleGeo, particleMat);
    fgScene.add(particles);

    // ── interaction state (targets set by events, lerped in the loop) ──
    const target = { mouseX: 0, mouseY: 0, scroll: 0 };
    const current = { scroll: 0, camZ: 5, camRotZ: 0 };

    // throttled pointer input — one uniform update per frame at most
    let lastPointerTs = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointerTs < 16) return; // ~60Hz cap on input processing
      lastPointerTs = now;
      target.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      target.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    // GSAP ScrollTrigger — bind document scroll to the scene, scrubbed
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        target.scroll = self.progress;
      },
    });
    refreshRef.current = () => ScrollTrigger.refresh();

    // ── resize ──
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      fgCamera.aspect = window.innerWidth / window.innerHeight;
      fgCamera.updateProjectionMatrix();
      if (!motionEnabled) renderStaticFrame();
    };

    // ── render loop: rAF + delta accumulator, capped at 60 fps ──
    const MAX_FPS = 60;
    const MIN_FRAME = 1000 / MAX_FPS;
    let rafId = 0;
    let lastFrame = performance.now();
    let elapsed = 0;
    let running = false;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      // smooth interpolation — mouse + cinematic camera lerp on scroll
      const mouse = uniforms.uMouse.value;
      mouse.x += (target.mouseX - mouse.x) * 0.045;
      mouse.y += (target.mouseY - mouse.y) * 0.045;

      current.scroll += (target.scroll - current.scroll) * 0.06;
      uniforms.uScroll.value = current.scroll;

      // camera narrative: slow dolly + drift as the page scrolls
      const targetCamZ = 5 - current.scroll * 1.4;
      const targetRotZ = current.scroll * 0.1;
      current.camZ += (targetCamZ - current.camZ) * 0.08;
      current.camRotZ += (targetRotZ - current.camRotZ) * 0.08;
      fgCamera.position.z = current.camZ;
      fgCamera.position.x = mouse.x * 0.2;
      fgCamera.position.y = mouse.y * 0.15;
      fgCamera.rotation.z = current.camRotZ;
      fgCamera.lookAt(0, 0, -1.2);

      // crystal: slow majestic turn; scroll sends it up and away
      crystal.rotation.x = elapsed * 0.10 + current.scroll * 1.6;
      crystal.rotation.y = elapsed * 0.16;
      crystal.position.y = -0.4 + Math.sin(elapsed * 0.35) * 0.08 + current.scroll * 3.2;
      crystal.position.x = mouse.x * 0.12;

      renderer.autoClear = true;
      renderer.render(bgScene, bgCamera);
      renderer.autoClear = false;
      renderer.render(fgScene, fgCamera);
    };

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const dt = now - lastFrame;
      if (dt < MIN_FRAME) return; // frame cap: identical speed on 60Hz and 144Hz
      lastFrame = now - (dt % MIN_FRAME);
      renderFrame(Math.min(dt, 100) / 1000);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      rafId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // reduced motion → single elegant static frame, no listeners burning CPU
    const renderStaticFrame = () => {
      uniforms.uMotion.value = 0;
      uniforms.uTime.value = 12;
      uniforms.uScroll.value = 0.15;
      crystal.rotation.set(0.5, 0.8, 0);
      renderer.autoClear = true;
      renderer.render(bgScene, bgCamera);
      renderer.autoClear = false;
      renderer.render(fgScene, fgCamera);
    };

    const applyMotionPreference = () => {
      motionEnabled = !reducedMotionQuery.matches;
      if (motionEnabled) {
        uniforms.uMotion.value = 1;
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        startLoop();
      } else {
        window.removeEventListener("pointermove", onPointerMove);
        stopLoop();
        renderStaticFrame();
      }
    };

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (motionEnabled) startLoop();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery.addEventListener("change", applyMotionPreference);
    applyMotionPreference();

    return () => {
      stopLoop();
      trigger.kill();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", applyMotionPreference);
      quadGeo.dispose();
      quadMat.dispose();
      crystalGeo.dispose();
      crystalEdges.dispose();
      crystalMat.dispose();
      edgeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      refreshRef.current = () => {};
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
