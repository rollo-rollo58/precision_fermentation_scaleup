import { FlaskConical, Activity, TestTubeDiagonal } from 'lucide-react';
import BiomassGLSeedBioreactorPanel05 from '../components/BiomassGLSeedBioreactorPanel05';
import BiomassGLSpargerPanel11 from '../components/BiomassGLSpargerPanel11';
import DissolvedOxygenPctProductPanel07 from '../components/DissolvedOxygenPctProductPanel07';
import DissolvedOxygenPctSeedBioPanel01 from '../components/DissolvedOxygenPctSeedBioPanel01';
import KlaPerHourGasAnalyzerPanel08 from '../components/KlaPerHourGasAnalyzerPanel08';
import KlaPerHourImpellerPanel02 from '../components/KlaPerHourImpellerPanel02';
import OffgasCo2PctGasAnalyzerPanel10 from '../components/OffgasCo2PctGasAnalyzerPanel10';
import OffgasCo2PctImpellerPanel04 from '../components/OffgasCo2PctImpellerPanel04';
import OxygenUptakeMmolLHProductPanel09 from '../components/OxygenUptakeMmolLHProductPanel09';
import OxygenUptakeMmolLHSeedBioPanel03 from '../components/OxygenUptakeMmolLHSeedBioPanel03';
import SubstrateGLGasAnalyzerPanel06 from '../components/SubstrateGLGasAnalyzerPanel06';
import SubstrateGLHarvestVesselPanel12 from '../components/SubstrateGLHarvestVesselPanel12';

export default function Page() {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-teal-300">
            <FlaskConical size={17} /> Bioprocess research / Fermentation systems
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Fermentation scale-up studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Model oxygen-transfer bottlenecks, substrate feeding and culture kinetics.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-teal-300">
            <Activity size={17} /> Research model
          </div>
          <p className="mt-1 text-xs text-slate-400">Synthetic series / not plant controls</p>
        </div>
      </header>
      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        <BiomassGLSeedBioreactorPanel05 />
        <div className="grid gap-4">
          <BiomassGLSpargerPanel11 />
          <DissolvedOxygenPctProductPanel07 />
        </div>
      </section>
      <div className="my-9 flex items-center gap-3">
        <TestTubeDiagonal size={22} className="text-teal-300" />
        <div>
          <h2 className="text-xl font-semibold">Process observation feeds</h2>
          <p className="text-sm text-slate-400">Review synthetic sensor scenarios by equipment.</p>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DissolvedOxygenPctSeedBioPanel01 />
        <KlaPerHourGasAnalyzerPanel08 />
        <KlaPerHourImpellerPanel02 />
        <OffgasCo2PctGasAnalyzerPanel10 />
        <OffgasCo2PctImpellerPanel04 />
        <OxygenUptakeMmolLHProductPanel09 />
        <OxygenUptakeMmolLHSeedBioPanel03 />
        <SubstrateGLGasAnalyzerPanel06 />
        <SubstrateGLHarvestVesselPanel12 />
      </section>
      <footer className="mt-10 border-t border-slate-800 py-5 text-xs text-slate-500">
        Models are exploratory, not validated bioprocess control or GMP release software.
      </footer>
    </main>
  );
}
