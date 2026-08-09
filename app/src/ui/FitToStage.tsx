import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type FitToStageProps = {
  children: ReactNode;
  token: string;
  className?: string;
  minScale?: number;
};

type FitBox = {
  scale: number;
  width: number;
  height: number;
};

/**
 * Scales children to fit the parent.
 * Uses a sized shell so transform:scale does not keep the old layout box
 * (which was clipping content on projectors).
 */
export function FitToStage({
  children,
  token,
  className = "",
  minScale = 0.42,
}: FitToStageProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<FitBox>({ scale: 1, width: 0, height: 0 });

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const content = contentRef.current;
    const parent = shell?.parentElement;
    if (!shell || !content || !parent) return;

    const fit = () => {
      // Measure at natural size
      shell.style.width = "auto";
      shell.style.height = "auto";
      content.style.transform = "none";
      content.style.position = "static";

      const needW = Math.ceil(content.scrollWidth);
      const needH = Math.ceil(content.scrollHeight);
      const availW = Math.max(0, parent.clientWidth - 12);
      const availH = Math.max(0, parent.clientHeight - 12);

      if (needW <= 0 || needH <= 0 || availW <= 0 || availH <= 0) {
        setBox({ scale: 1, width: needW, height: needH });
        return;
      }

      const next = Math.min(1, availW / needW, availH / needH);
      const scale = Math.max(minScale, Number(next.toFixed(3)));
      setBox({
        scale,
        width: Math.floor(needW * scale),
        height: Math.floor(needH * scale),
      });
    };

    fit();
    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    ro.observe(parent);
    window.addEventListener("resize", fit);
    // Second pass after fonts/images settle
    const t = window.setTimeout(fit, 120);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      window.clearTimeout(t);
    };
  }, [token, minScale]);

  const scaled = box.width > 0 && box.height > 0;

  return (
    <div
      ref={shellRef}
      className="fit-to-stage-shell"
      style={
        scaled
          ? {
              width: box.width,
              height: box.height,
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
            }
          : undefined
      }
    >
      <div
        ref={contentRef}
        className={`fit-to-stage${className ? ` ${className}` : ""}`}
        style={
          scaled
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                transform: `scale(${box.scale})`,
                transformOrigin: "top left",
                width: box.scale > 0 ? box.width / box.scale : undefined,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
