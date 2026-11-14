'use client';
import { useMemo, useState } from 'react';

export default function BiomassGLSpargerPanel11() {
  const [agitationRpm, setAgitationRpm] = useState(320);
  const [gasFlowVvm, setGasFlowVvm] = useState(0.8);
  const [temperatureC, setTemperatureC] = useState(30);
  const [biomassGL, setBiomassGL] = useState(9);
  const calculations = useMemo(() => {
    const saturation = Math.max(3, 8.9 - 0.17 * (temperatureC - 20));
    const kla = 50 * Math.pow(agitationRpm / 250, 0.7) *
      Math.pow(gasFlowVvm / 0.5, 0.45);
    const uptake = biomassGL * 4.5 * 32;
    const transfer = kla * saturation * 0.65;
    return { saturation, kla, uptake, transfer, headroom: transfer - uptake };
  }, [agitationRpm, gasFlowVvm, temperatureC, biomassGL]);
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/95 p-5">
      <p className="text-xs uppercase tracking-widest text-teal-300">Transfer capacity</p>
      <h2 className="mt-1 text-lg font-semibold">Bioreactor aeration workspace</h2>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <svg viewBox="0 0 160 220" role="img" aria-label="Aerated mixing vessel">
          <rect x="30" y="25" width="100" height="165" rx="25" fill="#0f172a"
            stroke="#5eead4" strokeWidth="3" />
          <rect x="32" y="65" width="96" height="105" rx="10" fill="#164e63" opacity=".75" />
          <path d="M80 5 V185" stroke="#e2e8f0" strokeWidth="5" />
          {[88, 130].map((y) => (
            <g key={y}>
              <path d={`M50 ${y} H110`} stroke="#5eead4" strokeWidth="8" />
              <path d={`M66 ${y - 12} L94 ${y + 12}`}
                stroke="#99f6e4" strokeWidth="4" />
            </g>
          ))}
          {[49, 68, 92, 109].map((x, index) => (
            <circle key={index} cx={x} cy={150 - index * 20}
              r={4 + index} fill="#bae6fd" opacity=".7" />
          ))}
          <path d="M30 198 H130" stroke="#475569" strokeWidth="5" />
        </svg>
        <div className="space-y-3 text-xs">
          {[
            ['Agitation rpm', agitationRpm, setAgitationRpm, 100, 900, 20],
            ['Aeration vvm', gasFlowVvm, setGasFlowVvm, 0.1, 3, 0.1],
            ['Broth temp C', temperatureC, setTemperatureC, 20, 40, 1],
            ['Biomass g/L', biomassGL, setBiomassGL, 1, 30, 1],
          ].map(([label, value, setter, min, max, step]) => (
            <label key={String(label)} className="block">
              <span className="flex justify-between text-slate-300">
                {label} <span>{Number(value).toFixed(1)}</span>
              </span>
              <input className="w-full accent-teal-400" type="range"
                min={Number(min)} max={Number(max)} step={Number(step)}
                value={Number(value)}
                onChange={(event) => (setter as (v: number) => void)(
                  Number(event.target.value),
                )} />
            </label>
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-3 text-sm">
        <div><dt className="text-slate-400">Estimated kLa</dt>
          <dd className="font-mono text-teal-300">
            {calculations.kla.toFixed(1)} /h</dd></div>
        <div><dt className="text-slate-400">Oxygen headroom</dt>
          <dd className={`font-mono ${calculations.headroom >= 0 ?
            'text-teal-300' : 'text-rose-300'}`}>
            {calculations.headroom.toFixed(0)} mg/L/h</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-400">
        Illustrative scaling correlations only; not equipment design ratings.
      </p>
    </article>
  );
}
