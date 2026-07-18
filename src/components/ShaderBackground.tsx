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
  IcosahedronGeometry,
  LineSegments,
  EdgesGeometry,
  LineBasicMaterial,
  Vector2,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// GLSL — 3D simplex noise (Ashima / Stefan Gustavson, MIT) + domain-warped fbm
// ─────────────────────────────────────────────────────────────────────────────

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;      // normalized -1..1, lerped on CPU
uniform vec2  uResolution;
uniform float uMotion;     // 1 = animated, 0 = static (reduced motion)

varying vec2 vUv;

// ── simplex 3D noise ──
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * snoise(p);
    p   *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = vUv;
  vec2 st = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  float t = uTime * 0.03 * uMotion + 8.0;

  // mouse influence — a very soft, wide brightening around the pointer
  vec2  m      = uMouse * vec2(uResolution.x / uResolution.y, 1.0) * 0.5;
  float mField = exp(-length(st - m) * 1.6) * 0.5;

  // large-scale, slow fbm — smooth washes of light, no folds or marbling
  vec3 p = vec3(st * 0.55, t);
  float n1 = fbm(p);
  float n2 = fbm(p * 0.7 + vec3(2.7, -1.3, t * 0.4) + n1 * 0.35);

  // palette — near-black base with faint violet / cyan washes
  vec3 base   = vec3(0.020, 0.020, 0.032);   // ~#050508
  vec3 violet = vec3(0.486, 0.227, 0.929);   // #7c3aed
  vec3 cyan   = vec3(0.024, 0.714, 0.831);   // #06b6d4

  // scroll gently shifts the hue balance; mouse adds a whisper of light
  float hueShift = clamp(uScroll * 0.8 + uMouse.x * 0.1, 0.0, 1.0);
  vec3 wash = mix(violet, cyan, smoothstep(-0.5, 0.5, n2) * 0.6 + hueShift * 0.4);

  float intensity = smoothstep(-0.2, 1.0, n1) * 0.045 + mField * 0.02;
  vec3 col = base + wash * intensity;

  // single faint aurora glow drifting down-screen with scroll
  float glow = smoothstep(1.1, 0.0, length(st - vec2(-0.45 + uScroll * 0.9, 0.32 - uScroll * 0.6)));
  col += mix(violet, cyan, uScroll) * glow * 0.028;

  // vignette
  float vig = smoothstep(1.6, 0.4, length(st));
  col *= vig;

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

// point sprites for the depth particle field
const PARTICLE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uMotion;
attribute float aScale;
attribute float aSpeed;
varying float vAlpha;

void main() {
  vec3 pos = position;
  pos.y += sin(uTime * aSpeed + pos.x * 2.0) * 0.18 * uMotion;
  pos.x += cos(uTime * aSpeed * 0.7 + pos.y * 1.5) * 0.12 * uMotion;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (12.0 / -mv.z);
  vAlpha = smoothstep(-9.0, -2.0, mv.z) * 0.28;
}
`;

const PARTICLE_FRAGMENT = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(0.55, 0.65, 1.0, a);
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
        antialias: false,
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

    // ── background fluid quad ──
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

    // ── foreground 3D layer: particles + wireframe icosahedron ──
    const fgScene = new Scene();
    const fgCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30);
    fgCamera.position.z = 5;

    const COUNT = 140;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -Math.random() * 7 - 1;
      scales[i] = Math.random() * 2.2 + 0.6;
      speeds[i] = Math.random() * 0.5 + 0.15;
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

    const icoGeo = new IcosahedronGeometry(1.6, 1);
    const icoEdges = new EdgesGeometry(icoGeo);
    const icoMat = new LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.07 });
    const ico = new LineSegments(icoEdges, icoMat);
    ico.position.set(2.6, 0.4, -2.5);
    fgScene.add(ico);

    // ── interaction state (targets set by events, lerped in the loop) ──
    const target = { mouseX: 0, mouseY: 0, scroll: 0 };
    const current = { scroll: 0, camZ: 5, camRotZ: 0 };

    // debounced/throttled pointer input — one uniform update per frame at most
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

      // smooth interpolation — mouse ripple + cinematic camera lerp on scroll
      const mouse = uniforms.uMouse.value;
      mouse.x += (target.mouseX - mouse.x) * 0.045;
      mouse.y += (target.mouseY - mouse.y) * 0.045;

      current.scroll += (target.scroll - current.scroll) * 0.06;
      uniforms.uScroll.value = current.scroll;

      // camera narrative: dolly in and tilt as the page scrolls
      const targetCamZ = 5 - current.scroll * 1.9;
      const targetRotZ = current.scroll * 0.22;
      current.camZ += (targetCamZ - current.camZ) * 0.08;
      current.camRotZ += (targetRotZ - current.camRotZ) * 0.08;
      fgCamera.position.z = current.camZ;
      fgCamera.position.x = mouse.x * 0.25;
      fgCamera.position.y = mouse.y * 0.18 + current.scroll * 0.6;
      fgCamera.rotation.z = current.camRotZ;
      fgCamera.lookAt(0, current.scroll * 0.6, -3);

      ico.rotation.x = elapsed * 0.08 + current.scroll * 2.4;
      ico.rotation.y = elapsed * 0.11;
      ico.position.y = 0.4 + Math.sin(elapsed * 0.4) * 0.15 - current.scroll * 1.2;

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
      uniforms.uScroll.value = 0.25;
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
      particleGeo.dispose();
      particleMat.dispose();
      icoGeo.dispose();
      icoEdges.dispose();
      icoMat.dispose();
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
