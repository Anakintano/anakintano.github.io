"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
} from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// A single, near-still light source drifting through a near-black field.
// No noise-marbling, no particles, no wireframe geometry — just a slow,
// barely-perceptible wash of light that answers the mouse and the scroll.
// ─────────────────────────────────────────────────────────────────────────────

const FRAGMENT_SHADER = /* glsl */ `
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

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 st = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * uMotion;

  // one soft light, drifting on a slow orbit and nudged by scroll + mouse
  vec2 lightPos = vec2(sin(t * 0.035) * 0.35, cos(t * 0.028) * 0.22);
  lightPos += uMouse * 0.08;
  lightPos.y -= uScroll * 0.5;

  float d = length(st - lightPos);
  float glow = exp(-d * 1.35) * 0.075;

  // second, dimmer companion light for depth
  vec2 lightPos2 = vec2(-0.4, 0.3 - uScroll * 0.35);
  float glow2 = exp(-length(st - lightPos2) * 1.8) * 0.032;

  // extremely fine film grain, static-feeling even though it's per-frame
  float grain = (hash21(gl_FragCoord.xy + t * 0.6) - 0.5) * 0.012;

  float vig = smoothstep(1.5, 0.2, length(st));

  vec3 col = vec3(0.024, 0.024, 0.025) + vec3(glow + glow2) ;
  col *= vig;
  col += grain;

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

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // no WebGL — the CSS base color stays visible
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motionEnabled = !reducedMotionQuery.matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime:       { value: 0 },
      uScroll:     { value: 0 },
      uMouse:      { value: new Vector2(0, 0) },
      uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uMotion:     { value: motionEnabled ? 1 : 0 },
    };
    const geo = new PlaneGeometry(2, 2);
    const mat = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new Mesh(geo, mat));

    const target = { mouseX: 0, mouseY: 0, scroll: 0 };

    let lastPointerTs = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointerTs < 32) return; // throttle to ~30Hz — this layer is decorative
      lastPointerTs = now;
      target.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      target.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        target.scroll = self.progress;
      },
    });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      if (!motionEnabled) renderStaticFrame();
    };

    const MAX_FPS = 30; // this background never needs more — it's nearly still
    const MIN_FRAME = 1000 / MAX_FPS;
    let rafId = 0;
    let lastFrame = performance.now();
    let elapsed = 0;
    let running = false;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      const mouse = uniforms.uMouse.value;
      mouse.x += (target.mouseX - mouse.x) * 0.03;
      mouse.y += (target.mouseY - mouse.y) * 0.03;

      uniforms.uScroll.value += (target.scroll - uniforms.uScroll.value) * 0.05;

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const dt = now - lastFrame;
      if (dt < MIN_FRAME) return;
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
      uniforms.uTime.value = 4;
      uniforms.uScroll.value = 0;
      renderer.render(scene, camera);
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
      geo.dispose();
      mat.dispose();
      renderer.dispose();
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
