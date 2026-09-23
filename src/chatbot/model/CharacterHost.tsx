import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Environment, useBounds } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import type { CharacterState } from './animationConfig';

type Framing = 'full' | 'bust';

// How much closer than the full-body fit distance the camera sits for 'bust'
// framing (smaller = bigger/closer), and how far up (as a fraction of the
// full-body height) the look-at target is raised to land around chest/head.
const BUST_ZOOM = 0.45; //0.45
const BUST_VERTICAL_OFFSET = 0.2;

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
        light.position.set(
          ...edgeLightPosition(config, edgeAngles.current[i]),
        );
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

interface CharacterHostProps {
  state: CharacterState;
  reducedMotion: boolean;
  isDark: boolean;
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
  /** When true, the canvas clears to transparent instead of opaque black,
   * so a CSS glow layer behind it can show through and bleed into the
   * background around the character. */
  transparentBackground?: boolean;
}

function RefitOnChange({
  fitKey,
  framing,
}: {
  fitKey: string;
  framing: Framing;
}) {
  const bounds = useBounds();
  const { camera, size } = useThree();
  useEffect(() => {
    bounds.refresh();
    if (framing === 'bust') {
      const { center, size: boxSize, distance } = bounds.getSize();
      const target = new THREE.Vector3(
        center.x,
        center.y + boxSize.y * BUST_VERTICAL_OFFSET,
        center.z,
      );
      const direction = camera.position.clone().sub(center).normalize();
      bounds
        .moveTo(target.clone().addScaledVector(direction, distance * BUST_ZOOM))
        .lookAt({ target });
    } else {
      bounds.fit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, framing, size.width, size.height]);
  return null;
}

export function CharacterHost({
  state,
  reducedMotion,
  isDark,
  isCoarsePointer,
  isTabVisible,
  mouseLook,
  framing = 'full',
  fitKey,
  transparentBackground = false,
}: CharacterHostProps) {
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
      <Suspense fallback={null}>
        {/* The character's PBR material (metallic/roughness + normal map)
         * needs reflections to read correctly — without an environment map,
         * directional-only lighting makes the normal map look noisy/bumpy. */}
        <Environment preset="forest" />
        <Bounds clip observe margin={1.2}>
          <RefitOnChange fitKey={fitKey} framing={framing} />
          <CharacterModel
            state={state}
            reducedMotion={reducedMotion}
            mouseLook={mouseLook}
          />
        </Bounds>
      </Suspense>
      {/* <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.3}
          intensity={0.8}
          mipmapBlur
        />
      </EffectComposer> */}
    </Canvas>
  );
}
