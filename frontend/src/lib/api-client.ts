import type { Assessment, Observation } from '../types/domain';
const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export async function evaluate(observation: Observation): Promise<Assessment> {
  const response = await fetch(`${base}/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(observation),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Evaluation unavailable: ${response.status}`);
  }
  return response.json() as Promise<Assessment>;
}
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${base}/health`, { cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}
import type {
  FermentationInputs, FermentationPoint, BatchSummary,
} from '../types/domain';

export async function simulateFermentation(
  input: FermentationInputs,
): Promise<{ points: FermentationPoint[]; summary: BatchSummary }> {
  const response = await fetch(`${base}/api/fermentation/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Simulation failed: ${response.status}`);
  }
  return response.json() as Promise<{
    points: FermentationPoint[];
    summary: BatchSummary;
  }>;
}
