/**
 * Shared, deterministic geometry for the hero globe. Used by both the
 * WebGL scene and the static SVG fallback so they look the same.
 */
export type Vec3 = [number, number, number];

/** Evenly spread points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius = 1): Vec3[] {
  const points: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

/** Connects each point to its nearest neighbours; returns unique index pairs. */
export function nearestEdges(points: Vec3[], neighbours = 3): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  points.forEach((p, i) => {
    const byDistance = points
      .map((q, j) => ({ j, d: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours);
    for (const { j } of byDistance) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      }
    }
  });
  return edges;
}

export const GLOBE_NODE_COUNT = 110;
export const GLOBE_RADIUS = 1.25;

let cached: { points: Vec3[]; edges: [number, number][] } | null = null;
export function globeGeometry() {
  if (!cached) {
    const points = fibonacciSphere(GLOBE_NODE_COUNT, GLOBE_RADIUS);
    cached = { points, edges: nearestEdges(points, 3) };
  }
  return cached;
}

/** Rotates a point around the Y then X axis. */
export function rotate([x, y, z]: Vec3, rotY: number, rotX: number): Vec3 {
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rotX), sx = Math.sin(rotX);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}
