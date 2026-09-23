import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type * as THREE from 'three';

// Same easing shape as the SVG RobotHead's parallax gaze — a target vector in
// [-1, 1]² that the current value exponentially chases every frame, so the
// head settles smoothly instead of snapping to the cursor.
const REACH_PX = 400; // pointer distance at which the look is fully deflected
const TIME_CONSTANT = 0.15; // seconds; ≈~85% caught up after one time constant
const MAX_YAW = 0.35; // rad
const MAX_PITCH = 0.18; // rad

interface UseMouseLookOptions {
  enabled: boolean;
  /** The object to rotate — typically a specific bone (e.g. the head), not
   * the model's root, so only that part turns toward the cursor. */
  node: React.RefObject<THREE.Object3D | null>;
}

/** Eases `node`'s rotation toward the cursor, added on top of whatever
 * rotation it already has that frame. This runs after the AnimationMixer's
 * own per-frame update (useAnimations subscribes to useFrame first, and
 * react-three-fiber runs same-priority subscribers in subscription order),
 * so the mixer sets the bone's animated pose first and this layers the
 * look-at offset on top of it, every frame — never fighting the clip. */
export function useMouseLook({ enabled, node }: UseMouseLookOptions) {
  const { gl } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  // Captured from the node's own rotation on the first frame it's available,
  // so it reflects whatever pose the mixer actually holds it at (rather than
  // guessing a base rotation from outside).
  const base = useRef<{ x: number; y: number; z: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = gl.domElement;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / REACH_PX, 1);
      target.current.x = (dx / dist) * reach;
      target.current.y = (dy / dist) * reach;
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, gl]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const obj = node.current;
    if (!obj) return;

    if (!base.current) {
      base.current = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };
    }

    const k = 1 - Math.exp(-delta / TIME_CONSTANT);
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;

    obj.rotation.set(
      base.current.x + current.current.y * MAX_PITCH,
      base.current.y + current.current.x * MAX_YAW,
      base.current.z,
    );
  });
}
