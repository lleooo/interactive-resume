import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { MODEL_URL, type CharacterState } from './animationConfig';
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
  mouseLook?: boolean;
}

// `state` and `reducedMotion` are unused until the clip playback below is
// re-enabled (the current model only has a rest pose).
export function CharacterModel({ mouseLook = false }: CharacterModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene: cachedScene } = useGLTF(MODEL_URL);

  const scene = useMemo(() => {
    const cloned = cloneSkeleton(cachedScene) as THREE.Object3D;

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

  const headRef = useRef<THREE.Object3D | null>(null);
  useEffect(() => {
    headRef.current = scene.getObjectByName(HEAD_BONE_NAME) ?? null;
  }, [scene]);

  useMouseLook({ enabled: mouseLook, node: headRef });

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
