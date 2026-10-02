import { useSyncExternalStore } from 'react';
import { isBootLoaderDone, subscribeBootLoaderDone } from '../bootLoader';

/** Lets entrance animations wait until the boot loader stops covering them. */
export function useBootLoaderDone(): boolean {
  return useSyncExternalStore(subscribeBootLoaderDone, isBootLoaderDone);
}
