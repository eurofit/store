import { useEffect, useState } from 'react';

export function useInView(ref?: React.Ref<HTMLElement> | null, threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node =
      ref && typeof ref !== 'function'
        ? ref.current
        : (ref as React.RefCallback<HTMLElement> & { current?: HTMLElement | null })
            ?.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [ref, threshold]);

  return isInView;
}
