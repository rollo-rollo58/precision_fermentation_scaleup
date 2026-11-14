'use client';
import { useMemo, useState } from 'react';
import { simulateFermentation } from '../lib/api-client';
import type {
  FermentationInputs, FermentationPoint, BatchSummary,
} from '../types/domain';

const baseInputs: FermentationInputs = {
  hours: 36, stepHours: 0.1, temperatureC: 30,
  klaPerHour: 110, dissolvedOxygenPercent: 65, biomassGL: 0.8,
  initialSubstrateGL: 35, maximumGrowthPerHour: 0.29,
  halfSaturationGL: 1.8, oxygenHalfSaturationMgL: 0.4,
  oxygenDemandMmolGH: 4.5, biomassYieldGPerG: 0.48,
  feedGLPerHour: 0.32,
};

const inputs: ReadonlyArray<{
  key: keyof FermentationInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = [
  { key: 'klaPerHour', label: 'kLa', min: 10, max: 400, step: 5, unit: '/h' },
  { key: 'dissolvedOxygenPercent', label: 'Initial DO',
    min: 5, max: 100, step: 5, unit: '%' },
  { key: 'maximumGrowthPerHour', label: 'μ max',
    min: 0.02, max: 1, step: 0.01, unit: '/h' },
  { key: 'feedGLPerHour', label: 'Feed rate',
    min: 0, max: 4, step: 0.05, unit: 'g/L/h' },
  { key: 'oxygenDemandMmolGH', label: 'Specific OUR',
    min: 0.2, max: 12, step: 0.2, unit: 'mmol/g/h' },
];

function linePath(
  series: FermentationPoint[],
  key: 'biomassGL' | 'substrateGL' | 'dissolvedOxygenMgL',
) {
  const max = Math.max(1, ...series.map((sample) => sample[key]));
  return series.filter((_, index) => index % 4 === 0).map((sample, index, list) => {
    const x = 10 + index * 610 / Math.max(1, list.length - 1);
    const y = 226 - 205 * sample[key] / max;
    return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export default function BiomassGLSeedBioreactorPanel05() {
  const [parameters, setParameters] = useState(baseInputs);
  const [points, setPoints] = useState<FermentationPoint[]>([]);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const last = useMemo(() => points.at(-1), [points]);

  async function run() {
    setBusy(true);
    setError('');
    try {
      const output = await simulateFermentation(parameters);
      setSummary(output.summary);
      setPoints(output.points);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Simulation unavailable');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-teal-500/30 bg-slate-950/95 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-teal-300">Growth kinetics</p>
          <h2 className="mt-1 text-xl font-semibold">Fed-batch simulation studio</h2>
          <p className="mt-1 text-xs text-slate-400">
            Illustrative Monod kinetics and dynamic oxygen balance.
          </p>
        </div>
        <button onClick={run} disabled={busy} type="button"
          className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950"
        >{busy ? 'Computing' : 'Run model'}</button>
      </header>
      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          {inputs.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 flex justify-between text-xs text-slate-300">
                {field.label}
                <output className="font-mono text-teal-300">
                  {parameters[field.key].toFixed(2)} {field.unit}
                </output>
              </span>
              <input type="range" min={field.min} max={field.max} step={field.step}
                value={parameters[field.key]}
                onChange={(event) => setParameters((previous) => ({
                  ...previous, [field.key]: Number(event.target.value),
                }))}
                className="w-full accent-teal-400" />
            </label>
          ))}
        </div>
        <div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="text-teal-300">Biomass</span>
            <span className="text-amber-300">Residual substrate</span>
            <span className="text-sky-300">Dissolved oxygen</span>
          </div>
          <svg viewBox="0 0 630 245" role="img"
            aria-label="Normalized fermentation trajectory"
            className="mt-3 w-full rounded-lg bg-slate-900">
            {[42, 88, 134, 180, 226].map((y) => (
              <line key={y} x1="10" x2="620" y1={y} y2={y}
                stroke="#334155" strokeDasharray="3 5" />
            ))}
            {points.length ? (
              <>
                <path d={linePath(points, 'biomassGL')}
                  stroke="#5eead4" strokeWidth="2" fill="none" />
                <path d={linePath(points, 'substrateGL')}
                  stroke="#fcd34d" strokeWidth="2" fill="none" />
                <path d={linePath(points, 'dissolvedOxygenMgL')}
                  stroke="#7dd3fc" strokeWidth="2" fill="none" />
              </>
            ) : (
              <text x="315" y="126" fill="#94a3b8" fontSize="14"
                textAnchor="middle">Run a scenario to populate trends</text>
            )}
          </svg>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
            <div>Final biomass<div className="mt-1 font-mono text-lg text-teal-300">
              {last ? last.biomassGL.toFixed(2) : '--'} g/L</div></div>
            <div>Minimum oxygen<div className="mt-1 font-mono text-lg text-sky-300">
              {summary ? summary.minimumOxygenMgL.toFixed(2) : '--'} mg/L</div></div>
            <div>Productivity<div className="mt-1 font-mono text-lg text-amber-300">
              {summary ? summary.biomassProductivityGLH.toFixed(3) : '--'} g/L/h</div></div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
        </div>
      </div>
    </article>
  );
}
