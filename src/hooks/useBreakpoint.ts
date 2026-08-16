import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return Boolean(window.matchMedia(MOBILE_QUERY).matches);
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    try {
      const mql = window.matchMedia(MOBILE_QUERY);
      if (!mql) return;
      setIsMobile(Boolean(mql.matches));

      const handler = (e: MediaQueryListEvent) => {
        setIsMobile(Boolean(e.matches));
      };

      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
      } else if (typeof mql.addListener === 'function') {
        mql.addListener(handler);
        return () => mql.removeListener(handler);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  return { isMobile, isDesktop: !isMobile };
}

