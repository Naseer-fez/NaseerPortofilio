import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return { isMobile, isDesktop: !isMobile };
}
