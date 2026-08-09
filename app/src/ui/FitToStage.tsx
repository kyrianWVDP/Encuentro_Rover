import type { ReactNode } from "react";
import { useFitScale } from "./useFitScale";

type FitToStageProps = {
  children: ReactNode;
  token: string;
  className?: string;
  minScale?: number;
};

/** Wraps projector content and scales it down until it fits on screen. */
export function FitToStage({
  children,
  token,
  className = "",
  minScale = 0.5,
}: FitToStageProps) {
  const { ref, scale } = useFitScale(true, token, minScale);
  return (
    <div
      ref={ref}
      className={`fit-to-stage${className ? ` ${className}` : ""}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
