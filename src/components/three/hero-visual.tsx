"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

/** Falls back to the static globe if anything inside the 3D scene throws. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Decide whether this device should get the WebGL scene. */
function shouldUse3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Phones keep the static globe: it looks the same and protects battery and responsiveness.
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  return supportsWebGL();
}

/**
 * Hero visual. Always renders the static fallback first (fast, accessible),
 * then upgrades to the interactive 3D globe after the page is idle, only on
 * capable devices and only while the hero is on screen.
 */
export function HeroVisual({ fallback, label }: { fallback: ReactNode; label: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!shouldUse3D()) return;
    const start = () => setEnabled(true);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => motion.matches && setEnabled(false);
    motion.addEventListener("change", onMotion);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  const show3D = enabled && !failed;

  return (
    <div ref={wrapper} role="img" aria-label={label} className="relative aspect-square w-full" data-visual-mode={show3D && ready ? "3d" : "static"}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${show3D && ready ? "opacity-0" : "opacity-100"}`}>
        {fallback}
      </div>
      {show3D ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneBoundary onError={() => setFailed(true)}>
            <HeroScene active={visible} onReady={() => setReady(true)} onFail={() => setFailed(true)} />
          </SceneBoundary>
        </div>
      ) : null}
    </div>
  );
}
