'use client';
import { useEffect, useState } from 'react';
import { openTelemetryStream } from '../lib/websocket-stream';
export function useDomainTelemetry(metric: string, size = 32) {
  const [samples, setSamples] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    return openTelemetryStream(metric, (value) => {
      setSamples((previous) => [...previous.slice(-(size - 1)), value]);
    });
  }, [metric, paused, size]);
  return { samples, paused, setPaused };
}
