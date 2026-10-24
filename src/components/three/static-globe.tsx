import { GLOBE_RADIUS, globeGeometry, rotate } from "./globe-geometry";

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Lightweight SVG version of the hero globe. Rendered on the server, so it is
 * visible immediately, without JavaScript, and when WebGL is unavailable.
 */
export function StaticGlobe({ className = "" }: { className?: string }) {
  const { points, edges } = globeGeometry();
  const projected = points.map((p) => rotate(p, 0.6, 0.38));
  // Depth (z) towards the viewer is positive; map it to opacity.
  const alpha = (z: number) => 0.18 + 0.82 * ((z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS));
  const s = 1.7;

  return (
    <svg viewBox={`${-s} ${-s} ${s * 2} ${s * 2}`} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="sg-core" cx="0" cy="0" r="1.3" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4C7DFF" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#22D3EE" stopOpacity="0.06" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="1.45" fill="url(#sg-core)" />
      <ellipse rx="1.6" ry="0.42" fill="none" stroke="#7096FF" strokeOpacity="0.28" strokeWidth="0.008" transform="rotate(-18)" />
      <ellipse rx="1.52" ry="0.6" fill="none" stroke="#22D3EE" strokeOpacity="0.2" strokeWidth="0.006" transform="rotate(24)" />
      <g stroke="#7096FF" strokeWidth="0.006">
        {edges.map(([a, b]) => {
          const pa = projected[a]!, pb = projected[b]!;
          return (
            <line
              key={`${a}-${b}`}
              x1={r3(pa[0])} y1={r3(-pa[1])} x2={r3(pb[0])} y2={r3(-pb[1])}
              strokeOpacity={r3(alpha((pa[2] + pb[2]) / 2) * 0.55)}
            />
          );
        })}
      </g>
      <g>
        {projected.map((p, i) => (
          <circle
            key={i}
            cx={r3(p[0])} cy={r3(-p[1])}
            r={i % 9 === 0 ? 0.03 : 0.018}
            fill={i % 9 === 0 ? "#67E8F9" : "#9DB6FF"}
            fillOpacity={r3(alpha(p[2]))}
          />
        ))}
      </g>
    </svg>
  );
}
