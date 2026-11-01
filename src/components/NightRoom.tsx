"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { latestRun, type Run } from "@/lib/run";

// Units are centimetres: CSS3D text stays sharp at this scale.
const ACCENT = "#7CF0C8";
const LAMP = "#F2B36B";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// camera keyframes over hero scroll progress: [p, position, lookAt]
const KEYS: [number, THREE.Vector3, THREE.Vector3][] = [
  [0.0, new THREE.Vector3(-110, 165, 330), new THREE.Vector3(0, 115, -60)],
  [0.28, new THREE.Vector3(-35, 135, 185), new THREE.Vector3(0, 95, -20)],
  [0.48, new THREE.Vector3(0, 112, 85), new THREE.Vector3(0, 86, -6)],
  [0.8, new THREE.Vector3(6, 104, 64), new THREE.Vector3(0, 86, -9)],
];

const COMMANDS: Record<string, { mood: string; lamp?: number; out: (string | [string, string])[] }> = {
  help: { mood: ACCENT, out: ["about   who I am", "work    what I've shipped", "stack   what I run", "posts   what I write", "contact how to reach me", "deploy  replay the deploy", "clear"] },
  about: {
    mood: "#9FD3FF",
    out: [
      "Aditya Saxena, DevOps / MLOps engineer.",
      "CS @ KIIT, class of 2026. I take code and models",
      "from a notebook to something that runs reliably.",
      ["more below", "#about"],
    ],
  },
  work: {
    mood: ACCENT,
    out: [
      "hindalco  ML/DevOps intern: 36,000+ records piped,",
      "          95% accurate quality model, 12% throughput",
      "phishai   routed DistilBERT models, 0.9707 F1 (email)",
      "replift   offline-first sync engine, 54 passing tests",
      ["open work", "#work"],
    ],
  },
  stack: { mood: "#C6A5FF", out: ["jenkins  docker  kubernetes  terraform  aws", "github-actions  n8n  python  sql  w&b"] },
  posts: { mood: "#9FD3FF", out: [["read the posts", "/blog/"]] },
  contact: {
    mood: LAMP,
    lamp: 1.6,
    out: [
      ["email     madityasaxena@gmail.com", "mailto:madityasaxena@gmail.com"],
      ["resume    resume.pdf", "/resume.pdf"],
      ["linkedin  adityasaxena-devops", "https://www.linkedin.com/in/adityasaxena-devops"],
      ["github    Anakintano", "https://github.com/Anakintano"],
    ],
  },
};

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function NightRoom() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const stage = stageRef.current!;
    const intro = introRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      wrap.style.display = "none"; // no WebGL: the HTML sections below carry everything
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const css = new CSS3DRenderer();
    css.domElement.className = "css3d";
    stage.appendChild(css.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05060A");
    scene.fog = new THREE.Fog("#05060A", 300, 700);
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 2000);

    const mat = (color: string, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o });
    const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      b.position.set(x, y, z);
      b.castShadow = b.receiveShadow = true;
      parent.add(b);
      return b;
    };

    // room
    const wood = mat("#3a2a1e", { roughness: 0.7 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat("#1c1612"));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    box(900, 420, 2, mat("#15161c"), 0, 210, -150);

    // window behind the desk: night sky + rain layer
    const sky = canvasTex(256, 256, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 256);
      gr.addColorStop(0, "#0b1530");
      gr.addColorStop(1, "#1d2c4f");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
      const moon = g.createRadialGradient(190, 60, 2, 190, 60, 60);
      moon.addColorStop(0, "rgba(220,230,255,.9)");
      moon.addColorStop(0.15, "rgba(180,200,255,.25)");
      moon.addColorStop(1, "rgba(180,200,255,0)");
      g.fillStyle = moon;
      g.fillRect(0, 0, 256, 256);
    });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(150, 170), new THREE.MeshBasicMaterial({ map: sky, fog: false }));
    win.position.set(0, 185, -148.5);
    scene.add(win);
    const rainTex = canvasTex(128, 256, (g) => {
      g.strokeStyle = "rgba(190,210,255,.35)";
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 128, y = Math.random() * 256;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x - 1, y + 10 + Math.random() * 14);
        g.stroke();
      }
    });
    rainTex.wrapS = rainTex.wrapT = THREE.RepeatWrapping;
    rainTex.repeat.set(2, 1.5);
    const rain = new THREE.Mesh(new THREE.PlaneGeometry(150, 170), new THREE.MeshBasicMaterial({ map: rainTex, transparent: true, fog: false }));
    rain.position.set(0, 185, -148);
    scene.add(rain);
    const frame = mat("#0d0d10");
    for (const [w, h, x, y] of [[156, 6, 0, 270], [156, 6, 0, 100], [6, 176, -78, 185], [6, 176, 78, 185], [3, 170, 0, 185], [150, 3, 0, 185]])
      box(w, h, 4, frame, x, y, -147);

    // bookshelves either side of the window
    const books: [number, number, number, number, number, number][] = [];
    for (const ux of [-190, 190]) {
      box(150, 280, 34, wood, ux, 140, -132);
      for (let s = 0; s < 6; s++) {
        const y = 20 + s * 44;
        box(146, 3, 32, wood, ux, y, -128);
        for (let x = ux - 70; x < ux + 66; ) {
          const w = 2.5 + Math.random() * 3.5, h = 24 + Math.random() * 12;
          if (Math.random() > 0.08) books.push([x + w / 2, y + 1.5 + h / 2, -124, w, h, 18 + Math.random() * 6]);
          x += w + 0.3;
        }
      }
    }
    const tones = ["#4a1f1c", "#1f3326", "#2a2340", "#3b2f22", "#1b2a3a", "#5a4a2e", "#2b2b2b"].map((c) => new THREE.Color(c));
    const bookMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat("#ffffff", { roughness: 0.9 }), books.length);
    const m4 = new THREE.Matrix4();
    books.forEach(([x, y, z, w, h, d], i) => {
      bookMesh.setMatrixAt(i, m4.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(w, h, d)));
      bookMesh.setColorAt(i, tones[i % tones.length]);
    });
    bookMesh.castShadow = bookMesh.receiveShadow = true;
    scene.add(bookMesh);

    // desk
    box(140, 4, 70, wood, 0, 73, 0);
    for (const [x, z] of [[-65, -30], [65, -30], [-65, 30], [65, 30]]) box(4, 71, 4, wood, x, 35.5, z);
    box(18, 4, 24, mat("#5a2a22"), -48, 77, 8).rotation.y = 0.3; // a closed book
    box(16, 3, 22, mat("#1f3326"), -47, 80.5, 7).rotation.y = 0.15;

    // lamp
    const metal = mat("#20201f", { metalness: 0.6, roughness: 0.4 });
    const lampG = new THREE.Group();
    lampG.position.set(46, 75, -18);
    scene.add(lampG);
    const lampPart = (geo: THREE.BufferGeometry, y: number, rx = 0) => {
      const m = new THREE.Mesh(geo, metal);
      m.position.y = y;
      m.rotation.x = rx; // no castShadow: the light sits inside the arm and shade
      lampG.add(m);
      return m;
    };
    lampPart(new THREE.CylinderGeometry(7, 8, 2, 24), 1);
    lampPart(new THREE.CylinderGeometry(0.8, 0.8, 42, 8), 22);
    const shade = lampPart(new THREE.ConeGeometry(9, 12, 24, 1, true), 42);
    shade.material = new THREE.MeshStandardMaterial({ color: "#20201f", metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(2.5), new THREE.MeshBasicMaterial({ color: "#000" }));
    bulb.position.y = 38;
    lampG.add(bulb);
    const lamp = new THREE.SpotLight(LAMP, 0, 260, 0.85, 0.6, 0);
    lamp.position.set(46, 113, -18);
    lamp.target.position.set(10, 75, 5);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.bias = -0.0005;
    scene.add(lamp, lamp.target);
    const lampFill = new THREE.PointLight(LAMP, 0, 400, 0);
    lampFill.position.set(40, 120, 10);
    scene.add(lampFill);

    // moonlight + ambient
    const moon = new THREE.DirectionalLight("#8fa8d8", 0.9);
    moon.position.set(60, 260, -400);
    scene.add(moon, new THREE.HemisphereLight("#3a4870", "#1a120c", 1.1));

    // laptop
    const shell = mat("#2c2f36", { metalness: 0.7, roughness: 0.35 });
    box(34, 2, 24, shell, 0, 76, 5);
    const lid = new THREE.Group();
    lid.position.set(0, 77, -7);
    scene.add(lid);
    box(34, 1, 24, shell, 0, 0.5, 12, lid);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(32, 20), new THREE.MeshBasicMaterial({ color: "#030605" }));
    glass.position.set(0, -0.05, 12);
    glass.rotation.x = Math.PI / 2;
    lid.add(glass);
    const glow = new THREE.PointLight(ACCENT, 0, 160, 0);
    glow.position.set(0, 92, 20);
    scene.add(glow);

    // the screen: real DOM, mounted on the lid
    const screen = document.createElement("div");
    screen.className = "screen";
    screen.innerHTML = `<div class="out" aria-live="polite"></div><form class="prompt"><span>$</span><input aria-label="Laptop terminal command" autocomplete="off" spellcheck="false" /></form><div class="chips"></div>`;
    const out = screen.querySelector(".out") as HTMLDivElement;
    const input = screen.querySelector("input")!;
    const chips = screen.querySelector(".chips")!;
    const screenObj = new CSS3DObject(screen);
    screenObj.scale.setScalar(32 / 640);
    screenObj.position.set(0, -0.1, 12);
    screenObj.rotation.x = Math.PI / 2;
    lid.add(screenObj);

    const print = (line: string | [string, string], cls = "") => {
      const el = document.createElement(typeof line === "string" ? "div" : "a");
      if (typeof line === "string") el.textContent = line;
      else {
        el.textContent = `→ ${line[0]}`;
        (el as HTMLAnchorElement).href = line[1];
        if (line[1].startsWith("http")) (el as HTMLAnchorElement).target = "_blank";
      }
      el.className = cls;
      out.appendChild(el);
      while (out.children.length > 14) out.firstChild!.remove(); // ponytail: fixed line budget, no scrollback
    };

    let mood = { color: new THREE.Color(ACCENT), lamp: 1 };
    const run = (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      print(`$ ${cmd}`, "dim");
      if (!cmd) return;
      if (cmd === "clear") return void out.replaceChildren();
      if (cmd === "deploy") return void boot(false);
      const c = COMMANDS[cmd];
      if (!c) return print(`command not found: ${cmd}. try help`);
      c.out.forEach((l) => print(l));
      mood = { color: new THREE.Color(c.mood), lamp: c.lamp ?? 1 };
    };
    screen.querySelector("form")!.addEventListener("submit", (e) => {
      e.preventDefault();
      run(input.value);
      input.value = "";
    });
    for (const name of ["about", "work", "stack", "posts", "contact"]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = name;
      b.onclick = () => run(name);
      chips.appendChild(b);
    }
    screen.addEventListener("click", (e) => {
      if (!(e.target as HTMLElement).closest("a,button")) input.focus({ preventScroll: true });
    });

    const runP = latestRun();
    let booted = false;
    let timers: number[] = [];
    const later = (ms: number, f: () => void) => timers.push(window.setTimeout(f, reduced ? 0 : ms));
    function boot(first: boolean) {
      timers.forEach(clearTimeout);
      timers = [];
      out.replaceChildren();
      let t = 0;
      const at = (dt: number, f: () => void) => later((t += dt), f);
      if (first)
        ["AS-BOOK  night library build", "[ ok ] mounting /home/aditya", "[ ok ] docker daemon ready", "[ ok ] network: github.com"].forEach((l) =>
          at(260, () => print(l, "dim")),
        );
      runP.then((r: Run) => {
        at(300, () => print(`$ gh run view ${r.id}${r.live ? "" : "   (snapshot)"}`));
        for (const j of r.jobs) {
          at(250, () => print(`● ${j.name}`));
          for (const s of j.steps) at(Math.max(140, (s.secs ?? 1) * 110), () => print(`  ✓ ${s.name.padEnd(34).slice(0, 34)} ${s.secs ?? "…"}s`, "ok"));
          at(200, () => print(`✓ ${j.name} ${j.secs ?? "…"}s`, "ok"));
        }
        at(400, () => print(`deployed ${r.sha} → anakintano.github.io`, "hi"));
        at(300, () => print("type help, or pick one below"));
      });
    }

    // dust in the lamp light
    const dustN = 350;
    const dustPos = new Float32Array(dustN * 3).map((_, i) => [Math.random() * 160 - 80, Math.random() * 90 + 75, Math.random() * 120 - 60][i % 3]);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: LAMP, size: 0.6, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // input
    let target = 0, p = 0, mx = 0, my = 0, w = 0, h = 0;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      target = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    };
    const onResize = () => {
      w = stage.clientWidth;
      h = stage.clientHeight;
      renderer.setSize(w, h);
      css.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("pointermove", onMove);

    const pos = new THREE.Vector3(), look = new THREE.Vector3(), tmp = new THREE.Vector3();
    const glowColor = new THREE.Color(ACCENT);
    const clock = new THREE.Clock();
    let raf = 0;
    const frameLoop = () => {
      raf = requestAnimationFrame(frameLoop);
      if (wrap.getBoundingClientRect().bottom < 0) return; // off-screen: skip the render
      const dt = Math.min(clock.getDelta(), 0.05);
      p = reduced ? target : p + (target - p) * 0.1;

      // camera path
      let k = 0;
      while (k < KEYS.length - 2 && p > KEYS[k + 1][0]) k++;
      const [p0, a0, l0] = KEYS[k], [p1, a1, l1] = KEYS[k + 1];
      const t = ss(p0, p1, p);
      pos.lerpVectors(a0, a1, t);
      look.lerpVectors(l0, l1, t);
      // final framing: back off so the 32cm screen fits narrow (phone) viewports
      const fit = 19 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
      if (p > KEYS[2][0] && fit > look.distanceTo(pos)) pos.addVectors(look, tmp.subVectors(pos, look).setLength(fit));
      const sway = reduced ? 0 : 1 - ss(0.6, 0.8, p) * 0.8;
      pos.x += mx * 14 * sway;
      pos.y -= my * 7 * sway;
      camera.position.copy(pos);
      camera.lookAt(look);

      // act 2: lamp clicks on; act 3: lid opens, screen wakes
      const on = ss(0.34, 0.37, p);
      lamp.intensity = on * 4 * mood.lamp;
      lampFill.intensity = on * 0.6 * mood.lamp;
      (bulb.material as THREE.MeshBasicMaterial).color.setRGB(on, on * 0.75, on * 0.45);
      dustMat.opacity = on * 0.7;
      lid.rotation.x = -1.85 * ss(0.46, 0.58, p);
      const wake = ss(0.56, 0.6, p);
      screen.style.opacity = String(wake);
      screen.style.visibility = wake > 0.01 ? "visible" : "hidden";
      glowColor.lerp(mood.color, 0.06);
      glow.color.copy(glowColor);
      glow.intensity = wake * 0.9;
      if (wake > 0.9 && !booted) {
        booted = true;
        boot(true);
      }
      intro.style.opacity = String(1 - ss(0.1, 0.24, p));

      if (!reduced) {
        rainTex.offset.y += dt * 1.6;
        for (let i = 1; i < dustN * 3; i += 3) dustPos[i] = dustPos[i] > 165 ? 75 : dustPos[i] + dt * 0.6;
        dustGeo.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      css.render(scene, camera);
    };
    frameLoop();

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      renderer.dispose();
      stage.replaceChildren(intro);
    };
  }, []);

  return (
    <div ref={wrapRef} className="room">
      <div ref={stageRef} className="stage">
        <div ref={introRef} className="intro">
          <h1>Aditya Saxena</h1>
          <p>DevOps and MLOps engineer. I build the pipelines that take code and models to production.</p>
        </div>
      </div>
    </div>
  );
}
