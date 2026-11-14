export type FermentationInputs = {
  hours: number;
  stepHours: number;
  temperatureC: number;
  klaPerHour: number;
  dissolvedOxygenPercent: number;
  biomassGL: number;
  initialSubstrateGL: number;
  maximumGrowthPerHour: number;
  halfSaturationGL: number;
  oxygenHalfSaturationMgL: number;
  oxygenDemandMmolGH: number;
  biomassYieldGPerG: number;
  feedGLPerHour: number;
};

export type FermentationPoint = {
  hour: number;
  biomassGL: number;
  substrateGL: number;
  dissolvedOxygenMgL: number;
  oxygenTransferMgLH: number;
  oxygenUptakeMgLH: number;
  specificGrowthPerHour: number;
  cumulativeFeedGL: number;
  carbonDioxideProxyGL: number;
};

const boundaries: ReadonlyArray<[keyof FermentationInputs, number, number]> = [
  ['hours', 0.5, 120],
  ['stepHours', 0.02, 2],
  ['temperatureC', 15, 45],
  ['klaPerHour', 0.1, 1200],
  ['dissolvedOxygenPercent', 0, 100],
  ['biomassGL', 0.001, 200],
  ['initialSubstrateGL', 0, 500],
  ['maximumGrowthPerHour', 0, 2],
  ['halfSaturationGL', 0.001, 100],
  ['oxygenHalfSaturationMgL', 0.001, 20],
  ['oxygenDemandMmolGH', 0, 300],
  ['biomassYieldGPerG', 0.01, 1.5],
  ['feedGLPerHour', 0, 100],
];

export const defaultFermentationInputs: FermentationInputs = {
  hours: 36,
  stepHours: 0.1,
  temperatureC: 30,
  klaPerHour: 110,
  dissolvedOxygenPercent: 65,
  biomassGL: 0.8,
  initialSubstrateGL: 35,
  maximumGrowthPerHour: 0.29,
  halfSaturationGL: 1.8,
  oxygenHalfSaturationMgL: 0.4,
  oxygenDemandMmolGH: 4.5,
  biomassYieldGPerG: 0.48,
  feedGLPerHour: 0.32,
};

export function validateFermentationInputs(
  inputs: FermentationInputs,
): FermentationInputs {
  for (const [key, minimum, maximum] of boundaries) {
    const value = inputs[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${key} must be a finite number`);
    }
    if (value < minimum || value > maximum) {
      throw new Error(`${key} must be between ${minimum} and ${maximum}`);
    }
  }
  return inputs;
}

/** Illustrative oxygen saturation; not a validated physical property model. */
export function saturationOxygenMgL(temperatureC: number): number {
  return Math.max(3, 8.9 - 0.17 * (temperatureC - 20));
}

/** Monod growth model with a separate dissolved-oxygen limitation term. */
export function monodGrowthPerHour(
  maxGrowthPerHour: number,
  substrateGL: number,
  halfSaturationGL: number,
  dissolvedOxygenMgL: number,
  oxygenHalfSaturationMgL: number,
): number {
  const substrateFactor = substrateGL / (halfSaturationGL + substrateGL);
  const oxygenFactor = dissolvedOxygenMgL /
    (oxygenHalfSaturationMgL + dissolvedOxygenMgL);
  return maxGrowthPerHour * substrateFactor * oxygenFactor;
}

/** Mass-transfer and oxygen-uptake terms expressed in mg O2 / L / h. */
export function oxygenBudget(
  klaPerHour: number,
  saturationMgL: number,
  measuredOxygenMgL: number,
  biomassGL: number,
  demandMmolGH: number,
) {
  const transferMgLH = klaPerHour * Math.max(0, saturationMgL - measuredOxygenMgL);
  const uptakeMgLH = biomassGL * demandMmolGH * 32;
  return {
    transferMgLH,
    uptakeMgLH,
    netMgLH: transferMgLH - uptakeMgLH,
    demandCoverage: uptakeMgLH > 0 ? transferMgLH / uptakeMgLH : 1,
  };
}

export function runBatchSimulation(input: FermentationInputs): FermentationPoint[] {
  const params = validateFermentationInputs(input);
  const maximumOxygenMgL = saturationOxygenMgL(params.temperatureC);
  let oxygenMgL = maximumOxygenMgL * params.dissolvedOxygenPercent / 100;
  let biomass = params.biomassGL;
  let substrate = params.initialSubstrateGL;
  let feedTotal = 0;
  let co2Proxy = 0;
  const output: FermentationPoint[] = [];
  let elapsed = 0;
  const maxSteps = Math.ceil(params.hours / params.stepHours);
  for (let index = 0; index <= maxSteps; index += 1) {
    const growth = monodGrowthPerHour(
      params.maximumGrowthPerHour,
      substrate,
      params.halfSaturationGL,
      oxygenMgL,
      params.oxygenHalfSaturationMgL,
    );
    const oxygen = oxygenBudget(
      params.klaPerHour,
      maximumOxygenMgL,
      oxygenMgL,
      biomass,
      params.oxygenDemandMmolGH,
    );
    output.push({
      hour: Number(elapsed.toFixed(6)),
      biomassGL: biomass,
      substrateGL: substrate,
      dissolvedOxygenMgL: oxygenMgL,
      oxygenTransferMgLH: oxygen.transferMgLH,
      oxygenUptakeMgLH: oxygen.uptakeMgLH,
      specificGrowthPerHour: growth,
      cumulativeFeedGL: feedTotal,
      carbonDioxideProxyGL: co2Proxy,
    });
    if (elapsed >= params.hours) break;
    const deltaHours = Math.min(params.stepHours, params.hours - elapsed);
    const biomassCreated = Math.min(
      biomass * Math.expm1(growth * deltaHours),
      (substrate + params.feedGLPerHour * deltaHours) * params.biomassYieldGPerG,
    );
    const feed = params.feedGLPerHour * deltaHours;
    const substrateUsed = biomassCreated / params.biomassYieldGPerG;
    substrate = Math.max(0, substrate + feed - substrateUsed);
    biomass += biomassCreated;
    feedTotal += feed;
    co2Proxy += substrateUsed * 0.42;
    oxygenMgL = Math.min(maximumOxygenMgL, Math.max(
      0, oxygenMgL + oxygen.netMgLH * deltaHours,
    ));
    elapsed += deltaHours;
  }
  return output;
}

export function summarizeBatch(points: FermentationPoint[]) {
  if (!points.length) throw new Error('At least one point is required');
  const first = points[0];
  const last = points[points.length - 1];
  const hours = last.hour - first.hour;
  const integratedOxygenUptake = points.slice(1).reduce(
    (total, point, index) => {
      const previous = points[index];
      return total + (point.hour - previous.hour) *
        (point.oxygenUptakeMgLH + previous.oxygenUptakeMgLH) / 2;
    },
    0,
  );
  return {
    durationHours: hours,
    finalBiomassGL: last.biomassGL,
    finalSubstrateGL: last.substrateGL,
    biomassProductivityGLH: hours > 0 ?
      (last.biomassGL - first.biomassGL) / hours : 0,
    minimumOxygenMgL: Math.min(...points.map((point) => point.dissolvedOxygenMgL)),
    totalOxygenUsedMgL: integratedOxygenUptake,
    cumulativeFeedGL: last.cumulativeFeedGL,
  };
}

import { Injectable } from '@nestjs/common';
import type { Rule, Observation, Assessment } from './rule.model';
import { rules as r01 } from './rules_01';
import { rules as r02 } from './rules_02';
import { rules as r03 } from './rules_03';
import { rules as r04 } from './rules_04';
import { rules as r05 } from './rules_05';
import { rules as r06 } from './rules_06';
import { rules as r07 } from './rules_07';
import { rules as r08 } from './rules_08';
import { rules as r09 } from './rules_09';
import { rules as r10 } from './rules_10';
import { rules as r11 } from './rules_11';
import { rules as r12 } from './rules_12';
import { rules as r13 } from './rules_13';

@Injectable()
export class EngineService {
  private readonly records: ReadonlyArray<Rule> = [...r01, ...r02, ...r03, ...r04, ...r05,
    ...r06, ...r07, ...r08, ...r09, ...r10,
    ...r11, ...r12, ...r13];

  rules(metric?: string): ReadonlyArray<Rule> {
    return this.records.filter((item) => !metric || item.metric === metric).slice(0, 50);
  }

  evaluate(item: Observation): Assessment {
    if (!Number.isFinite(item.value) || Math.abs(item.value) > 1e12) {
      throw new Error('unsupported measurement');
    }
    let candidates = this.records.filter((entry) =>
      entry.metric === item.metric && entry.asset === item.asset
      && entry.scenario === item.scenario,
    );
    if (!candidates.length) {
      candidates = this.records.filter((entry) => entry.metric === item.metric);
    }
    if (!candidates.length) throw new Error('unknown metric');
    const distance = (record: Rule) => {
      const gap = Math.max(record.lower - item.value, 0, item.value - record.upper);
      return gap / Math.max(record.upper - record.lower, 0.001);
    };
    const selected = candidates.reduce((a, b) => distance(a) < distance(b) ? a : b);
    const score = Math.min(1, distance(selected) * selected.weight * selected.confidence);
    return {
      score: Math.round(score * 1_000_000) / 1_000_000,
      rule: selected.code,
      severity: score > 0 ? selected.severity : 'normal',
      action: selected.action,
    };
  }
}
