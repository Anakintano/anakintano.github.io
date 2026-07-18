"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Points,
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  NormalBlending,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// A painterly anime dusk, rendered live: layered gradient sky, slow fbm
// clouds catching the last light, a low sun, hill silhouettes, and sakura
// petals drifting down. No video file — it loops forever and weighs nothing.
// ─────────────────────────────────────────────────────────────────────────────

const SKY_FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;
uniform vec2  uResolution;
uniform float uMotion;

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

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  float t = uTime * uMotion;

  // gentle parallax: mouse shifts the whole scene a touch, scroll lifts it
  uv.x += uMouse.x * 0.012;
  uv.y += uMouse.y * 0.008 + uScroll * 0.10;

  // ── sky gradient — peach horizon through rose into evening indigo ──
  vec3 cHorizon = vec3(1.00, 0.83, 0.62);
  vec3 cRose    = vec3(0.96, 0.62, 0.54);
  vec3 cViolet  = vec3(0.55, 0.42, 0.62);
  vec3 cIndigo  = vec3(0.23, 0.22, 0.40);

  float h = clamp(uv.y, 0.0, 1.0);
  vec3 sky = mix(cHorizon, cRose, smoothstep(0.05, 0.38, h));
  sky = mix(sky, cViolet, smoothstep(0.35, 0.68, h));
  sky = mix(sky, cIndigo, smoothstep(0.62, 1.0, h));

  // ── sun — low, hazy, warm (kept soft so type stays legible) ──
  vec2 sunPos = vec2(0.72, 0.34);
  vec2 sd = (uv - sunPos) * vec2(aspect, 1.0);
  float sun = exp(-length(sd) * 10.0);
  float halo = exp(-length(sd) * 2.6);
  sky += vec3(1.00, 0.82, 0.52) * sun * 0.45;
  sky += vec3(1.00, 0.70, 0.44) * halo * 0.20;

  // ── clouds — painterly fbm bands, lit from the sun side ──
  vec2 cp = vec2(uv.x * aspect * 1.4 + t * 0.008, uv.y * 2.2);
  float warp = vnoise(cp * 1.6) - 0.5;
  float cl = fbm(cp + warp * 0.6);
  float band = smoothstep(0.48, 0.72, cl) * smoothstep(0.95, 0.45, h);
  float lit = smoothstep(0.7, 0.2, length(sd));
  vec3 cloudCol = mix(vec3(0.55, 0.47, 0.60), vec3(1.0, 0.82, 0.66), lit);
  sky = mix(sky, cloudCol, band * 0.55);

  // high wisps — reuse the same field at a different threshold
  float wisp = smoothstep(0.62, 0.85, cl);
  sky = mix(sky, vec3(0.85, 0.70, 0.72), wisp * 0.15 * smoothstep(0.4, 0.9, h));

  // ── hills — two silhouette layers along the bottom ──
  float hill1 = 0.16 + vnoise(vec2(uv.x * 2.6 + 5.0, 0.0)) * 0.09;
  float hill2 = 0.085 + vnoise(vec2(uv.x * 3.4 + 40.0, 0.0)) * 0.06;
  float inHill1 = smoothstep(hill1 + 0.004, hill1 - 0.004, uv.y);
  float inHill2 = smoothstep(hill2 + 0.004, hill2 - 0.004, uv.y);
  vec3 hillFar  = vec3(0.34, 0.26, 0.36);
  vec3 hillNear = vec3(0.16, 0.13, 0.20);
  sky = mix(sky, hillFar, inHill1);
  sky = mix(sky, hillNear, inHill2);

  // fine painterly grain
  sky += (hash21(gl_FragCoord.xy + t) - 0.5) * 0.018;

  // soft vignette
  vec2 vc = (vUv - 0.5) * vec2(aspect, 1.0);
  sky *= smoothstep(1.6, 0.55, length(vc)) * 0.25 + 0.78;

  gl_FragColor = vec4(sky, 1.0);
}
`;

const SKY_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// sakura petals as point sprites — soft rotated-ellipse shape, fluttering
const PETAL_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uMotion;
uniform float uScroll;
attribute float aScale;
attribute float aSpeed;
attribute float aPhase;
varying float vAlpha;
varying float vSpin;

void main() {
  vec3 pos = position;
  float t = uTime * uMotion;

  // fall and respawn: wrap y over a 10-unit tall column
  float fall = mod(pos.y - t * aSpeed * 0.55 + 5.0, 10.0) - 5.0;
  pos.y = fall;
  pos.x += sin(t * aSpeed * 0.9 + aPhase) * 0.55 + sin(t * 0.25 + aPhase * 3.0) * 0.35;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * (26.0 / -mv.z);
  vAlpha = smoothstep(-10.0, -3.0, mv.z) * (0.75 - uScroll * 0.5);
  vSpin = t * aSpeed * 2.0 + aPhase * 6.28;
}
`;

const PETAL_FRAGMENT = /* glsl */ `
varying float vAlpha;
varying float vSpin;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float c = cos(vSpin), s = sin(vSpin);
  p = mat2(c, -s, s, c) * p;
  // petal: ellipse squashed on one axis with a soft notch
  float d = length(p * vec2(1.4, 2.6));
  float petal = smoothstep(0.5, 0.30, d);
  float notch = smoothstep(0.10, 0.22, length(p - vec2(0.0, -0.18)));
  float a = petal * notch * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(1.0, 0.86, 0.90, a);
}
`;

export default function AnimeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch {
      return; // no WebGL — the CSS gradient fallback on the hero stays
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motionEnabled = !reducedMotionQuery.matches;

    // painterly gradients upscale invisibly — render at reduced internal
    // resolution so the fbm shader never dominates the frame budget
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.55;
    renderer.setPixelRatio(dpr);

    const size = () => ({ w: host.clientWidth, h: host.clientHeight });
    let { w, h } = size();
    renderer.setSize(w, h);

    // ── sky ──
    const skyScene = new Scene();
    const skyCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime:       { value: 0 },
      uScroll:     { value: 0 },
      uMouse:      { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(w, h) },
      uMotion:     { value: motionEnabled ? 1 : 0 },
    };
    const skyGeo = new PlaneGeometry(2, 2);
    const skyMat = new ShaderMaterial({
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    skyScene.add(new Mesh(skyGeo, skyMat));

    // ── petals ──
    const petalScene = new Scene();
    const petalCamera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 30);
    // use a perspective-free ortho column mapped to screen; fake depth via scale
    const COUNT = 46;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2.4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -(3 + Math.random() * 6);
      scales[i] = Math.random() * 2.4 + 1.0;
      speeds[i] = Math.random() * 0.6 + 0.35;
      phases[i] = Math.random();
    }
    const petalGeo = new BufferGeometry();
    petalGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    petalGeo.setAttribute("aScale", new Float32BufferAttribute(scales, 1));
    petalGeo.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));
    petalGeo.setAttribute("aPhase", new Float32BufferAttribute(phases, 1));
    const petalMat = new ShaderMaterial({
      vertexShader: PETAL_VERTEX,
      fragmentShader: PETAL_FRAGMENT,
      uniforms: {
        uTime:       uniforms.uTime,
        uScroll:     uniforms.uScroll,
        uPixelRatio: { value: dpr },
        uMotion:     uniforms.uMotion,
      },
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    });
    // petals live in a perspective-ish column: reuse ortho camera with z range
    const petals = new Points(petalGeo, petalMat);
    petalScene.add(petals);

    const target = { mouseX: 0, mouseY: 0, scroll: 0 };

    let lastPointerTs = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointerTs < 32) return;
      lastPointerTs = now;
      target.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      target.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    // scroll progress across the hero's own height — drives parallax + petal fade
    const trigger = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        target.scroll = self.progress;
      },
    });

    const onResize = () => {
      ({ w, h } = size());
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      if (!motionEnabled) renderStaticFrame();
    };

    const MAX_FPS = 30; // a near-still painting — leave the frame budget to GSAP
    const MIN_FRAME = 1000 / MAX_FPS;
    let rafId = 0;
    let lastFrame = performance.now();
    let elapsed = 0;
    let running = false;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      const mouse = uniforms.uMouse.value;
      mouse.x += (target.mouseX - mouse.x) * 0.08;
      mouse.y += (target.mouseY - mouse.y) * 0.08;
      uniforms.uScroll.value += (target.scroll - uniforms.uScroll.value) * 0.14;

      renderer.autoClear = true;
      renderer.render(skyScene, skyCamera);
      renderer.autoClear = false;
      renderer.render(petalScene, petalCamera);
    };

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const dt = now - lastFrame;
      if (dt < MIN_FRAME) return; // identical pacing on 60Hz and 144Hz panels
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

    const renderStaticFrame = () => {
      uniforms.uMotion.value = 0;
      uniforms.uTime.value = 30;
      uniforms.uScroll.value = 0;
      renderer.autoClear = true;
      renderer.render(skyScene, skyCamera);
      renderer.autoClear = false;
      renderer.render(petalScene, petalCamera);
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
      skyGeo.dispose();
      skyMat.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
