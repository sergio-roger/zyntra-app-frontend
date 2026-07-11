import React, { useEffect } from 'react';

export const useTick = (enabled: boolean, intervalMs = 30_000) => {
  const [, setTick] = React.useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
};
