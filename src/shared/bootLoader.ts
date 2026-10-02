// Typed access to the boot loader defined inline in index.html. It lives in
// the HTML (not React) so it can paint, creep and time out before any JS
// bundle has loaded; these are no-ops once it's gone.

interface BootLoader {
  /** 0–1; only ever moves forward. */
  setProgress: (progress: number) => void;
  finish: () => void;
  isDone: () => boolean;
}

declare global {
  interface Window {
    __bootLoader?: BootLoader;
  }
}

// Share of the bar reserved for downloading the JS bundles (which report no
// progress); the 3D asset download fills the rest.
const JS_SHARE = 0.2;

/** Reports 3D asset download progress (0–1). */
export function setBootAssetProgress(progress: number) {
  window.__bootLoader?.setProgress(JS_SHARE + (1 - JS_SHARE) * progress);
}

export function finishBootLoader() {
  window.__bootLoader?.finish();
}

/** True once the boot loader has started fading out (or was never there). */
export function isBootLoaderDone() {
  return window.__bootLoader?.isDone() ?? true;
}

export function subscribeBootLoaderDone(onDone: () => void) {
  window.addEventListener('boot-loader-done', onDone);
  return () => window.removeEventListener('boot-loader-done', onDone);
}
