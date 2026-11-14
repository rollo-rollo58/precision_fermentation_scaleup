import { io } from 'socket.io-client';

export type StreamHandler = (value: number) => void;
export function openTelemetryStream(
  metric: string,
  onValue: StreamHandler,
): () => void {
  const endpoint = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const socket = io(endpoint, { reconnectionDelayMax: 5000, timeout: 3000 });
  const onTelemetry = (payload: unknown) => {
    if (typeof payload !== 'object' || payload === null) return;
    const event = payload as { metric?: string; value?: number };
    if (event.metric === metric && typeof event.value === 'number') {
      onValue(event.value);
    }
  };
  socket.on('telemetry', onTelemetry);
  return () => {
    socket.off('telemetry', onTelemetry);
    socket.disconnect();
  };
}
