'use client';
import { useState } from 'react';

const phases = [
  { name: 'Inoculation', hours: 5, do: 76, feed: 0, description: 'Seed biomass acclimation' },
  { name: 'Exponential', hours: 13, do: 53, feed: 0.35,
    description: 'Fast substrate-limited growth' },
  { name: 'High-density', hours: 18, do: 38, feed: 1.25,
    description: 'Aeration and feeding bottleneck' },
  { name: 'Harvest', hours: 4, do: 65, feed: 0,
    description: 'Low-growth collection phase' },
];

export default function DissolvedOxygenPctProductPanel07() {
  const [active, setActive] = useState(1);
  const phase = phases[active];
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5">
      <p className="text-xs uppercase tracking-widest text-teal-300">Batch schedule</p>
      <h2 className="mt-1 text-lg font-semibold">Phase navigator</h2>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {phases.map((item, index) => (
          <button key={item.name} type="button" onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={`rounded-lg px-2 py-3 text-xs ${active === index ?
              'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
            <span className="block font-semibold">{index + 1}</span>
            <span className="mt-1 block truncate">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex justify-between gap-2">
        <div><p className="text-lg font-semibold">{phase.name}</p>
          <p className="text-xs text-slate-400">{phase.description}</p></div>
        <p className="font-mono text-teal-300">{phase.hours} h</p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div><dt className="text-slate-400">Typical DO</dt>
          <dd className="font-mono text-lg">{phase.do}%</dd></div>
        <div><dt className="text-slate-400">Feed rate</dt>
          <dd className="font-mono text-lg">{phase.feed} g/L/h</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-400">
        Illustrative batch schedule; adjust for organism and vessel class.
      </p>
    </article>
  );
}
