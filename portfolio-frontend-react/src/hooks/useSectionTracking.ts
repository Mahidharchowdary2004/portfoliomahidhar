import { useEffect, useRef } from 'react';
import { API_BASE, track } from '../api/client';

export function useSectionTracking(sectionId: string) {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (!API_BASE) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !tracked.current) {
            tracked.current = true;
            track('pageview', sectionId);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId]);

  return ref;
}
