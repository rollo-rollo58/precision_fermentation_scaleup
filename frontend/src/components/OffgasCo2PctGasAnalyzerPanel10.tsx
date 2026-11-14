'use client';
import { useMemo, useState } from 'react';
import { useDomainTelemetry } from '../hooks/useDomainTelemetry';
import { evaluate } from '../lib/api-client';
import type { Assessment, Observation } from '../types/domain';

export default function OffgasCo2PctGasAnalyzerPanel10() {
  const metric = 'offgas_co2_pct' as const;
  const { samples, paused, setPaused } = useDomainTelemetry(metric);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(1);
  const latest = samples.at(-1) ?? 0;
  const average = useMemo(() => {
    if (!samples.length) return 0;
    return samples.reduce((sum, item) => sum + item, 0) / samples.length;
  }, [samples]);
  const points = samples.map((value, position) => {
    const x = 8 + position * (292 / Math.max(1, samples.length - 1));
    const y = 116 - Math.min(104, Math.max(4, value * 12 * scale));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  async function runAssessment() {
    setBusy(true);
    setError(null);
    const observation: Observation = {
      metric,
      asset: 'gas_analyzer' as Observation['asset'],
      scenario: 'oxygen_limitation' as Observation['scenario'],
      value: latest,
      timestamp: new Date().toISOString(),
    };
    try {
      setAssessment(await evaluate(observation));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="rounded-2xl border border-slate-700/70
      bg-slate-900/80 p-4 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Offgas Co2 Pct</h2>
          <p className="text-xs text-slate-400">Gas Analyzer observability</p>
        </div>
        <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs">
          #10
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between">
        <output className="text-2xl font-semibold tabular-nums">
          {latest.toFixed(2)}
        </output>
        <span className="text-xs text-slate-400">
          Avg {average.toFixed(2)}
        </span>
      </div>
      <svg viewBox="0 0 308 132" className="mt-3 w-full" role="img"
        aria-label="Offgas Co2 Pct time series">
        <path d="M8 116 H300" stroke="#475569" strokeWidth="1" />
        <path d="M8 60 H300" stroke="#334155" strokeDasharray="4 3" />
        {samples.map((value, i) => (
          <circle key={i} cx={8 + i * 9} cy={116 - value * 11 * scale}
            r={2.5 + (i % 3)} fill="#5eead4" />
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPaused(!paused)}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-xs
          hover:bg-slate-600">{paused ? 'Resume' : 'Pause'}</button>
        <button type="button" onClick={() => setScale((v) => v === 1 ? 2 : 1)}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-xs
          hover:bg-slate-700">Scale {scale}x</button>
        <button type="button" disabled={busy} onClick={runAssessment}
          className="rounded-md border border-accent/50 px-3 py-1.5
          text-xs text-accent hover:bg-accent/10 disabled:opacity-50">
          {busy ? 'Evaluating' : 'Evaluate'}</button>
      </div>
      {assessment && (
        <p className="mt-3 text-xs text-emerald-300" role="status">
          {assessment.severity}: {assessment.action}
        </p>
      )}
      {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
    </article>
  );
}
