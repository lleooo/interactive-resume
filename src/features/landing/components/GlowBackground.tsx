import { useEffect, useRef, useState } from 'react';

// The fuchsia glow rides along the edges of the screen, sitting on the side
// opposite the pointer. It eases its *angle* (not its x/y) toward the target
// so that when it swings to another side it travels around the edges instead
// of cutting across the middle of the screen.
const EDGE_GLOW_EASE = 0.08;
// Pointer offsets (normalized, -1..1) smaller than this near the screen
// center are ignored, so tiny moves there don't flip the glow to another side.
const EDGE_GLOW_DEAD_ZONE = 0.05;

// Maps an angle to a point on the edge of the [-1, 1] square.
function edgePoint(angle: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const scale = 1 / Math.max(Math.abs(dx), Math.abs(dy));
  return { x: dx * scale, y: dy * scale };
}

export function GlowBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouseRef = useRef(mouse);
  const edgeGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const next = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
      mouseRef.current = next;
      setMouse(next);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Start at the bottom-right corner.
    let angle = Math.PI / 4;
    let frame: number;
    const tick = () => {
      const { x, y } = mouseRef.current;
      if (Math.hypot(x, y) > EDGE_GLOW_DEAD_ZONE) {
        const target = Math.atan2(y, x);
        // Shortest way around the circle, so it never spins the long way.
        const delta = Math.atan2(
          Math.sin(target - angle),
          Math.cos(target - angle),
        );
        angle += delta * EDGE_GLOW_EASE;
      }
      const p = edgePoint(angle);
      if (edgeGlowRef.current) {
        // The wrapper is the size of the container, so 50% of it moves the
        // centered blob exactly onto an edge.
        edgeGlowRef.current.style.transform = `translate(${p.x * 50}%, ${p.y * 50}%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-[50%] bottom-0 h-180 w-180  transition-transform rounded-full blur-[60px] duration-200 ease-out bg-cyan-300/15  dark:#22C55E"
        style={{
          transform: `translate(calc(-50% + ${mouse.x * 100}px), calc(20% + ${mouse.y * 10}px))`,
        }}
      />
      <div
        ref={edgeGlowRef}
        className="absolute inset-0"
        style={{ transform: 'translate(50%, 50%)' }}
      >
        <div className="absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] bg-fuchsia-300/15  dark:bg-fuchsia-500/20" />
      </div>
      {/*<div className="absolute right-20 top-20 h-80 w-80 rounded-full bg-violet-300/30 blur-2xl dark:bg-violet-400/60" /> */}
    </div>
  );
}
