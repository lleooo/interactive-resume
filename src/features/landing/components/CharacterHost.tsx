import { Suspense, useEffect, useRef, type ComponentRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Bounds,
  Environment,
  OrbitControls,
  useBounds,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import type { CharacterState } from '../animationConfig';

type Framing = 'full' | 'bust';

// How much closer than the full-body fit distance the camera sits for 'bust'
// framing (smaller = bigger/closer), and how far up (as a fraction of the
// full-body height) the look-at target is raised to land around chest/head.
const BUST_ZOOM = 0.45; //0.45
const BUST_VERTICAL_OFFSET = 0.2;

// Wheel / pinch zoom, applied as camera.zoom so it stacks on top of whatever
// distance Bounds fitted to and survives refits. Range is relative to that
// fit (1 = as fitted); speed is zoom factor per unit of wheel deltaY.
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.5;
const WHEEL_ZOOM_SPEED = 0.001;
const ZOOM_EASE = 0.1;

// Drag-to-orbit: how far (radians) the camera may swing from its fitted
// angle horizontally / vertically, and how fast it eases back on release.
const ORBIT_MAX_AZIMUTH = Math.PI / 3;
const ORBIT_MAX_POLAR = Math.PI / 12;
const ORBIT_RETURN_EASE = 0.08;

// Two accent lights: a green backlight centered behind the character (base
// position echoes the CSS glow blob in GlowBackground.tsx — centered
// horizontally, sitting low — and follows the pointer mostly horizontally,
// same ratio as that blob), and a purple light in front of the character
// that rides the edges of a rectangle around it, like the fuchsia edge glow
// in GlowBackground.tsx.
type RimLight = {
  /** For 'edge' lights, the center of the rectangle the light rides. */
  position: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
  /** Lower = falls off more gradually with distance, so the light reads as
   * an even wash instead of a tight hotspot near whatever it's closest to. */
  decay: number;
} & (
  | {
      /** How far (world units) the light drifts toward the pointer on each
       * axis. */
      followX: number;
      followY: number;
    }
  | {
      /** Half-size (world units) of the rectangle, in the light's z plane,
       * whose edges the light slides along toward the pointer's side. */
      edge: { halfX: number; halfY: number };
    }
);

const RIM_LIGHTS: RimLight[] = [
  {
    // In front of the chest: the model is ~2.85 units tall (feet at y=0)
    // and faces +z with its front surface around z≈0.65, so y≈2 lands on
    // the shirt and z=1.5 keeps the light a little way off the body.
    position: [0, -3, -2.5],
    color: '#53EAFD', // Tailwind v4 cyan-300, matches the GlowBackground blob
    intensity: 10,
    distance: 70,
    decay: 1,
    followX: 0,
    followY: 0.16,
  }, // 綠色胸前光
  {
    // Rectangle centered on the chest (the model is ~2.85 units tall), a
    // bit wider than the shoulders, in front of the body (front surface is
    // around z≈0.65).
    position: [0, 2, 1.2],
    color: '#9c3af7',
    intensity: 3,
    distance: 4.5,
    decay: 1,
    edge: { halfX: 1.6, halfY: 1 },
  }, // 紫色前方光（沿邊框跟隨滑鼠）
];

// Lerp factor used to ease into each light's pointer offset every frame
// instead of snapping straight to it.
const MOUSE_LIGHT_EASE = 0.08;
// Same as GlowBackground's edge glow: pointer offsets smaller than this near
// the center are ignored so tiny moves there don't flip the light to another
// side, and edge lights start at the upper-right corner.
const EDGE_LIGHT_DEAD_ZONE = 0.05;
const EDGE_LIGHT_START_ANGLE = Math.PI / 4;

// Maps an angle to a point on the edge of the [-1, 1] square.
function edgePoint(angle: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const scale = 1 / Math.max(Math.abs(dx), Math.abs(dy));
  return { x: dx * scale, y: dy * scale };
}

function edgeLightPosition(
  light: RimLight & { edge: { halfX: number; halfY: number } },
  angle: number,
): [number, number, number] {
  const [cx, cy, cz] = light.position;
  const p = edgePoint(angle);
  return [cx + p.x * light.edge.halfX, cy + p.y * light.edge.halfY, cz];
}

function MouseFollowLights({ reducedMotion }: { reducedMotion: boolean }) {
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  // Current angle of each 'edge' light. It eases its angle rather than its
  // x/y so that switching sides travels around the edges instead of cutting
  // across the character.
  const edgeAngles = useRef<number[]>(
    RIM_LIGHTS.map(() => EDGE_LIGHT_START_ANGLE),
  );

  useFrame((state) => {
    if (reducedMotion) return;
    const { x, y } = state.pointer;
    lightRefs.current.forEach((light, i) => {
      if (!light) return;
      const config = RIM_LIGHTS[i];
      if ('edge' in config) {
        if (Math.hypot(x, y) > EDGE_LIGHT_DEAD_ZONE) {
          // state.pointer is y-up, same as world space, so this is the
          // pointer's side of the character.
          const target = Math.atan2(y, x);
          const angle = edgeAngles.current[i];
          // Shortest way around the circle, so it never spins the long way.
          const delta = Math.atan2(
            Math.sin(target - angle),
            Math.cos(target - angle),
          );
          edgeAngles.current[i] = angle + delta * MOUSE_LIGHT_EASE;
        }
        light.position.set(...edgeLightPosition(config, edgeAngles.current[i]));
        return;
      }
      const [baseX, baseY] = config.position;
      const { followX, followY } = config;
      light.position.x = THREE.MathUtils.lerp(
        light.position.x,
        baseX + x * followX,
        MOUSE_LIGHT_EASE,
      );
      light.position.y = THREE.MathUtils.lerp(
        light.position.y,
        baseY + y * followY,
        MOUSE_LIGHT_EASE,
      );
    });
  });

  return (
    <>
      {RIM_LIGHTS.map((light, i) => (
        <pointLight
          key={light.color}
          ref={(el) => {
            lightRefs.current[i] = el;
          }}
          position={
            'edge' in light
              ? edgeLightPosition(light, EDGE_LIGHT_START_ANGLE)
              : light.position
          }
          color={light.color}
          intensity={light.intensity}
          distance={light.distance}
          decay={light.decay}
        />
      ))}
    </>
  );
}

// Zooms the camera with the mouse wheel, or a two-finger pinch on touch
// screens. Listens on the canvas itself so scrolling other layers (e.g. the
// resume panel) never zooms the character.
function ZoomControls({ reducedMotion }: { reducedMotion: boolean }) {
  const { gl, camera } = useThree();
  const targetZoom = useRef(1);

  useEffect(() => {
    const el = gl.domElement;
    const zoomBy = (factor: number) => {
      targetZoom.current = THREE.MathUtils.clamp(
        targetZoom.current * factor,
        ZOOM_MIN,
        ZOOM_MAX,
      );
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Exponential so trackpads (many small deltas) and wheels (few large
      // ones) feel the same.
      zoomBy(Math.exp(-e.deltaY * WHEEL_ZOOM_SPEED));
    };

    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance: number | null = null;
    const currentPinchDistance = () => {
      if (pointers.size !== 2) return null;
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      pinchDistance = currentPinchDistance();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const distance = currentPinchDistance();
      if (distance && pinchDistance) zoomBy(distance / pinchDistance);
      pinchDistance = distance;
    };
    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinchDistance = currentPinchDistance();
    };

    // Stop the browser from pinch-zooming the page over the canvas so the
    // gesture reaches us as pointer events.
    const prevTouchAction = el.style.touchAction;
    el.style.touchAction = 'none';
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    return () => {
      el.style.touchAction = prevTouchAction;
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl]);

  useFrame(() => {
    const target = targetZoom.current;
    if (Math.abs(camera.zoom - target) < 1e-4) return;
    camera.zoom = reducedMotion
      ? target
      : THREE.MathUtils.lerp(camera.zoom, target, ZOOM_EASE);
    camera.updateProjectionMatrix();
  });

  return null;
}

// Dragging (mouse or one finger) orbits the camera around the Bounds target
// within a limited range, then eases back to the fitted angle on release.
// Zoom/pan are left to ZoomControls, so OrbitControls also ignores
// two-finger touches and the pinch gesture still reaches it.
function DragOrbit({ reducedMotion }: { reducedMotion: boolean }) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  // Angle the drag started from; captured per drag so a refit in between
  // (e.g. a resize) is picked up.
  const home = useRef<{ azimuth: number; polar: number } | null>(null);
  const returning = useRef(false);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      if (!returning.current) {
        const azimuth = controls.getAzimuthalAngle();
        const polar = controls.getPolarAngle();
        home.current = { azimuth, polar };
        controls.minAzimuthAngle = azimuth - ORBIT_MAX_AZIMUTH;
        controls.maxAzimuthAngle = azimuth + ORBIT_MAX_AZIMUTH;
        controls.minPolarAngle = polar - ORBIT_MAX_POLAR;
        controls.maxPolarAngle = polar + ORBIT_MAX_POLAR;
      }
      returning.current = false;
    };
    const onEnd = () => {
      returning.current = home.current !== null;
    };
    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
    };
  }, []);

  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  useFrame(() => {
    const controls = controlsRef.current;
    if (!returning.current || !home.current || !controls) return;
    const target = controls.target;
    const s = spherical.current.setFromVector3(
      offset.current.copy(camera.position).sub(target),
    );
    // Shortest way around, same as the edge lights.
    const dTheta = Math.atan2(
      Math.sin(home.current.azimuth - s.theta),
      Math.cos(home.current.azimuth - s.theta),
    );
    const dPhi = home.current.polar - s.phi;
    const done =
      reducedMotion || (Math.abs(dTheta) < 1e-3 && Math.abs(dPhi) < 1e-3);
    const k = done ? 1 : ORBIT_RETURN_EASE;
    s.theta += dTheta * k;
    s.phi += dPhi * k;
    camera.position.copy(target).add(offset.current.setFromSpherical(s));
    camera.lookAt(target);
    if (done) {
      returning.current = false;
      home.current = null;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping={false}
    />
  );
}

interface CharacterHostProps {
  state: CharacterState;
  reducedMotion: boolean;
  isCoarsePointer: boolean;
  isTabVisible: boolean;
  /** Turns the head toward the cursor; forwarded to CharacterModel. Off by
   * default so the small Companion dock is unaffected. */
  mouseLook?: boolean;
  /** 'full' fits the whole body in frame. 'bust' zooms in and raises the
   * look-at target so only the upper body/head fills the frame, cropping
   * the rest below the viewport. */
  framing?: Framing;
  /** Changes whenever the host's container is resized/reshaped (e.g. a tier
   * change), so the camera can re-fit to the new aspect ratio. */
  fitKey: string;
  /** Padding around the model when fitting the camera (1 = edge to edge). */
  fitMargin?: number;
  /** 3D asset download progress (0–1), from drei's loading manager. */
  onLoadProgress?: (progress: number) => void;
  /** Called once, after every asset has loaded and the first frame with the
   * character in it has rendered. */
  onReady?: () => void;
  /** When true, the canvas clears to transparent instead of opaque black,
   * so a CSS glow layer behind it can show through and bleed into the
   * background around the character. */
  transparentBackground?: boolean;
}

function RefitOnChange({
  fitKey,
  framing,
  fitMargin,
}: {
  fitKey: string;
  framing: Framing;
  fitMargin: number;
}) {
  const bounds = useBounds();
  const { camera, size } = useThree();
  // Viewing direction captured on the first fit and reused afterwards.
  // Re-deriving it from the camera's current position on every resize made
  // the angle drift: the camera sits relative to the raised target (not the
  // box center), and may be mid-animation, so each refit tilted it further.
  const fitDirection = useRef<THREE.Vector3 | null>(null);
  useEffect(() => {
    bounds.refresh();
    const { center, size: boxSize, distance } = bounds.getSize();
    fitDirection.current ??= camera.position.clone().sub(center).normalize();
    const direction = fitDirection.current;
    if (framing === 'bust') {
      const target = new THREE.Vector3(
        center.x,
        center.y + boxSize.y * BUST_VERTICAL_OFFSET,
        center.z,
      );
      bounds
        .moveTo(target.clone().addScaledVector(direction, distance * BUST_ZOOM))
        .lookAt({ target });
    } else {
      // Not bounds.fit(): drei sizes the fit by the box's largest side and
      // divides by aspect on portrait screens, so on a phone the body's
      // *height* got squeezed into the screen's *width* and the character
      // came out tiny. Fit the actual height and width separately instead.
      const perspective = camera as THREE.PerspectiveCamera;
      const tanHalfFov = Math.tan(
        THREE.MathUtils.degToRad(perspective.fov) / 2,
      );
      const fitHeight = boxSize.y / (2 * tanHalfFov);
      const fitWidth = boxSize.x / (2 * tanHalfFov * perspective.aspect);
      bounds
        .moveTo(
          center
            .clone()
            .addScaledVector(
              direction,
              fitMargin * Math.max(fitHeight, fitWidth),
            ),
        )
        .lookAt({ target: center });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, framing, fitMargin, size.width, size.height]);
  return null;
}

// Lives inside the Suspense boundary, so its first frame is the first one
// with the model and environment map in it.
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });
  return null;
}

export function CharacterHost({
  state,
  reducedMotion,
  isCoarsePointer,
  isTabVisible,
  mouseLook,
  framing = 'full',
  fitKey,
  fitMargin = 1.2,
  transparentBackground = false,
  onLoadProgress,
  onReady,
}: CharacterHostProps) {
  const { progress, total } = useProgress();
  useEffect(() => {
    if (total > 0) onLoadProgress?.(progress / 100);
  }, [progress, total, onLoadProgress]);

  return (
    <Canvas
      dpr={isCoarsePointer ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !isCoarsePointer, alpha: transparentBackground }}
      camera={{ fov: 35 }}
      frameloop={isTabVisible ? 'always' : 'never'}
    >
      {!transparentBackground && (
        <color attach="background" args={['#000000']} />
      )}
      <MouseFollowLights reducedMotion={reducedMotion} />
      <ZoomControls reducedMotion={reducedMotion} />
      <DragOrbit reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        {/* Self-hosted copy of drei's 'forest' preset, instead of fetching it
            from drei's CDN at runtime. */}
        <Environment files="/env/forest_slope_1k.hdr" />
        <Bounds clip observe margin={fitMargin}>
          <RefitOnChange
            fitKey={fitKey}
            framing={framing}
            fitMargin={fitMargin}
          />
          <CharacterModel
            state={state}
            reducedMotion={reducedMotion}
            mouseLook={mouseLook}
          />
        </Bounds>
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
