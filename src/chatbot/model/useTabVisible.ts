import { useEffect, useState } from 'react';

/** The Companion is `position: fixed`, so it never scrolls out of the
 * viewport — but there's still no point rendering it while the browser tab
 * itself is in the background. */
export function useTabVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return visible;
}
