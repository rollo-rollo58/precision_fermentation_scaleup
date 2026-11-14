export type Metric = (typeof metrics)[number];
export type Asset = (typeof assets)[number];
export type Scenario = (typeof scenarios)[number];
export const metrics = [
  "dissolved_oxygen_pct",
  "kla_per_hour",
  "oxygen_uptake_mmol_l_h",
  "offgas_co2_pct",
  "biomass_g_l",
  "substrate_g_l",
] as const;
export const assets = [
  "seed_bioreactor",
  "production_bioreactor",
  "sparger",
  "impeller",
  "gas_analyzer",
  "harvest_vessel",
] as const;
export const scenarios = [
  "inoculation",
  "exponential_growth",
  "feeding",
  "oxygen_limitation",
  "harvest",
  "cleaning",
] as const;
export interface Observation {
  metric: Metric;
  asset: Asset;
  scenario: Scenario;
  value: number;
  timestamp: string;
}
export interface Rule {
  code: string;
  metric: string;
  asset: string;
  scenario: string;
  severity: string;
  lower: number;
  upper: number;
  weight: number;
  confidence: number;
  action: string;
}
export interface Assessment {
  score: number;
  rule: string;
  severity: string;
  action: string;
}
export interface FermentationInputs {
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
}

export interface FermentationPoint {
  hour: number;
  biomassGL: number;
  substrateGL: number;
  dissolvedOxygenMgL: number;
  oxygenTransferMgLH: number;
  oxygenUptakeMgLH: number;
  specificGrowthPerHour: number;
  cumulativeFeedGL: number;
  carbonDioxideProxyGL: number;
}

export interface BatchSummary {
  durationHours: number;
  finalBiomassGL: number;
  finalSubstrateGL: number;
  biomassProductivityGLH: number;
  minimumOxygenMgL: number;
  totalOxygenUsedMgL: number;
  cumulativeFeedGL: number;
}
