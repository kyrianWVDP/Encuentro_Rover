import React, { useEffect, useState } from "react";

type TimerDisplayProps = {
  endsAt: number | null;
  running: boolean;
  remainingMs: number;
  size?: "hero" | "compact";
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  endsAt,
  running,
  remainingMs,
  size = "compact",
}) => {
  const [displayMs, setDisplayMs] = useState(remainingMs);

  useEffect(() => {
    if (!running || !endsAt) {
      setDisplayMs(remainingMs);
      return;
    }

    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, endsAt - now);
      setDisplayMs(left);

      if (left > 0) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, endsAt, remainingMs]);

  const seconds = Math.ceil(displayMs / 1000);
  const isWarning = seconds <= 9 && seconds > 0;
  const isDanger = seconds === 0;

  let timerClass = "timer-display";
  if (size === "hero") timerClass += " timer-hero";
  if (isWarning) timerClass += " timer-warning";
  if (isDanger) timerClass += " timer-danger";

  return (
    <div className={timerClass}>
      <span className="timer-value">{seconds}</span>
      <span className="timer-unit">s</span>
    </div>
  );
};
