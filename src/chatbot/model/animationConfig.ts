export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'talking'
  | 'greeting'
  | 'farewell';

export const MODEL_URL = '/model/me.glb';

// The current model only ships a static rest pose (no talk/wave/idle-loop
// clips) — every chat state holds it for now. Swap individual entries here
// once state-specific clips exist for this model.
const REST_CLIP = 'restpose';

export const CLIP_NAMES: Record<CharacterState, string> = {
  idle: REST_CLIP,
  thinking: REST_CLIP,
  talking: REST_CLIP,
  greeting: REST_CLIP,
  farewell: REST_CLIP,
};
