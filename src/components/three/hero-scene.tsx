"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  EllipseCurve,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Vector3,
} from "three";
import { globeGeometry } from "./globe-geometry";

/**
 * "Connected growth" globe: worldwide nodes linked by a network, with signals
 * travelling between them and two communication orbits. Loaded only on capable
 * devices (see hero-visual.tsx); everything here is decorative.
 */

const PULSE_COUNT = 28;

function useGlowTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(160,235,255,0.9)");
    g.addColorStop(1, "rgba(34,211,238,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
}

function Network() {
  const group = useRef<Group>(null);
  const nodes = useRef<InstancedMesh>(null);
  const glow = useGlowTexture();
  const { points, edges } = globeGeometry();

  const vectors = useMemo(() => points.map((p) => new Vector3(...p)), [points]);

  const lineGeometry = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr.set(points[a]!, i * 6);
      arr.set(points[b]!, i * 6 + 3);
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(arr, 3));
    return geo;
  }, [edges, points]);

  // Adjacency list so pulses can hop from edge to edge.
  const adjacency = useMemo(() => {
    const map = new Map<number, number[]>();
    edges.forEach(([a, b]) => {
      map.set(a, [...(map.get(a) ?? []), b]);
      map.set(b, [...(map.get(b) ?? []), a]);
    });
    return map;
  }, [edges]);

  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, (_, i) => {
        const edge = edges[(i * 37) % edges.length]!;
        return { from: edge[0], to: edge[1], t: (i % 10) / 10, speed: 0.35 + ((i * 13) % 10) / 20 };
      }),
    [edges],
  );

  const pulseGeometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3));
    return geo;
  }, []);

  const nodeGeometry = useMemo(() => new IcosahedronGeometry(0.022, 1), []);

  useEffect(() => {
    const mesh = nodes.current;
    if (!mesh) return;
    const m = new Matrix4();
    const accent = new Color("#67E8F9");
    const base = new Color("#9DB6FF");
    points.forEach((p, i) => {
      const scale = i % 9 === 0 ? 1.7 : 1;
      m.makeScale(scale, scale, scale).setPosition(p[0], p[1], p[2]);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, i % 9 === 0 ? accent : base);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points]);

  useEffect(
    () => () => {
      lineGeometry.dispose();
      pulseGeometry.dispose();
      nodeGeometry.dispose();
      glow.dispose();
    },
    [lineGeometry, pulseGeometry, nodeGeometry, glow],
  );

  const tmp = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    // Slow rotation plus a gentle tilt that follows the pointer.
    g.rotation.y += dt * 0.08;
    g.rotation.x += (state.pointer.y * 0.18 + 0.32 - g.rotation.x) * 0.04;
    g.rotation.z += (-state.pointer.x * 0.12 - g.rotation.z) * 0.04;

    const attr = pulseGeometry.getAttribute("position") as BufferAttribute;
    pulses.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const next = adjacency.get(p.to) ?? [p.from];
        p.from = p.to;
        p.to = next[(i + Math.floor(state.clock.elapsedTime * 7)) % next.length]!;
        p.t = 0;
      }
      tmp.copy(vectors[p.from]!).lerp(vectors[p.to]!, p.t);
      attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    });
    attr.needsUpdate = true;
  });

  return (
    <group ref={group} rotation={[0.32, 0.6, 0]}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#7096FF" transparent opacity={0.28} />
      </lineSegments>
      <instancedMesh ref={nodes} args={[nodeGeometry, undefined, points.length]}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <points geometry={pulseGeometry}>
        <pointsMaterial
          map={glow}
          size={0.11}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          color="#A5F3FC"
        />
      </points>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#4C7DFF" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Orbit({ rx, ry, tilt, color, speed }: { rx: number; ry: number; tilt: number; color: string; speed: number }) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(() => {
    const curve = new EllipseCurve(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(160).map((p) => new Vector3(p.x, p.y, 0));
    return new BufferGeometry().setFromPoints(pts);
  }, [rx, ry]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += Math.min(delta, 0.05) * speed;
  });
  return (
    <group rotation={[1.25, 0, tilt]}>
      <group ref={ref}>
        <lineLoop geometry={geometry}>
          <lineBasicMaterial color={color} transparent opacity={0.35} />
        </lineLoop>
      </group>
    </group>
  );
}

export default function HeroScene({ active, onReady, onFail }: { active: boolean; onReady: () => void; onFail: () => void }) {
  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
        // Show the canvas after the first frame has been drawn.
        requestAnimationFrame(() => onReady());
      }}
    >
      <Network />
      <Orbit rx={1.62} ry={1.62} tilt={0.3} color="#7096FF" speed={0.05} />
      <Orbit rx={1.5} ry={1.5} tilt={-0.5} color="#22D3EE" speed={-0.07} />
    </Canvas>
  );
}
