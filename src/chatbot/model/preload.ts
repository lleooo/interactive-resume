let started = false;

/** Kicks off the model download ahead of time (e.g. on launcher hover) so opening
 * the chat screen feels instant once the browser has it cached. */
export function preloadCharacterModel() {
  if (started) return;
  started = true;
  void import('./CharacterModel');
}
