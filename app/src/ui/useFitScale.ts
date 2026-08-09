import { useLayoutEffect, useRef, useState } from "react";

/** Scale an element so it fully fits inside its parent. */
export function useFitScale(
  enabled: boolean,
  token: string,
  minScale = 0.5,
): { ref: React.RefObject<HTMLDivElement | null>; scale: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!enabled) {
      setScale(1);
      return;
    }
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.transform = "scale(1)";
      const availW = Math.max(0, parent.clientWidth - 8);
      const availH = Math.max(0, parent.clientHeight - 8);
      const needW = el.offsetWidth;
      const needH = el.offsetHeight;
      if (needW <= 0 || needH <= 0 || availW <= 0 || availH <= 0) {
        setScale(1);
        return;
      }
      const next = Math.min(1, availW / needW, availH / needH);
      setScale(Math.max(minScale, Number(next.toFixed(3))));
    };

    fit();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(fit);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [enabled, token, minScale]);

  return { ref, scale };
}
