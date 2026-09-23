import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { CLIP_NAMES, MODEL_URL, type CharacterState } from './animationConfig';
import { useMouseLook } from './useMouseLook';

// Turn the character around its vertical axis to face the camera. In radians:
// 0 = as exported, Math.PI / 2 = quarter turn, Math.PI = fully around.
const ROTATION_Y = 0;
// GLTFLoader sanitizes node names on import (strips reserved characters,
// including ':'), so the glTF's raw "mixamorig:Head" bone name loads at
// runtime as "mixamorigHead" — see three.js's PropertyBinding.sanitizeNodeName.
const HEAD_BONE_NAME = 'mixamorigHead';
// The model's baked normal map reads as noisy/bumpy under directional-only
// lighting; the Environment map in CharacterHost softens that a lot, and
// this trims the remainder. 1 = the map's authored strength, 0 = flat.
const NORMAL_SCALE = 0;

interface CharacterModelProps {
  state: CharacterState;
  reducedMotion: boolean;
  /** Turns the head bone toward the cursor, added on top of the baked pose.
   * Off by default. */
  mouseLook?: boolean;
}

export function CharacterModel({
  state,
  reducedMotion,
  mouseLook = false,
}: CharacterModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene: cachedScene, animations } = useGLTF(MODEL_URL);

  // The Companion and the Landing hero can both be mounted at once and both
  // load this same cached GLTF (useGLTF/useLoader caches by URL) — clone the
  // scene per instance so each has its own independent object graph instead
  // of two <primitive> elements fighting over (and re-parenting) one shared
  // object. SkeletonUtils.clone (unlike a plain Object3D clone) preserves
  // skinned-mesh bone bindings correctly.
  const scene = useMemo(() => {
    const cloned = cloneSkeleton(cachedScene) as THREE.Object3D;
    // clone() shares materials by reference (it doesn't deep-clone them), so
    // this mutates the same material every instance uses — that's fine, it's
    // the same fix applied everywhere, and idempotent if it runs more than once.
    cloned.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const material of materials) {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.normalScale.set(NORMAL_SCALE, NORMAL_SCALE);
        }
      }
    });
    return cloned;
  }, [cachedScene]);

  // const { actions } = useAnimations(animations, group);

  const headRef = useRef<THREE.Object3D | null>(null);
  useEffect(() => {
    headRef.current = scene.getObjectByName(HEAD_BONE_NAME) ?? null;
  }, [scene]);

  useMouseLook({ enabled: mouseLook, node: headRef });

  // useEffect(() => {
  //   const action = actions[CLIP_NAMES[state]];
  //   if (!action) return;

  //   action
  //     .reset()
  //     .fadeIn(reducedMotion ? 0 : 0.3)
  //     .play();
  //   action.paused = reducedMotion;

  //   return () => {
  //     action.fadeOut(reducedMotion ? 0 : 0.2);
  //   };
  // }, [state, actions, reducedMotion]);

  return (
    <primitive
      ref={group}
      object={scene}
      rotation={[0.1, ROTATION_Y, 0]}
      dispose={null}
    />
  );
}

useGLTF.preload(MODEL_URL);
