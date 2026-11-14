export interface Rule {
  code: string;
  metric: string;
  asset: string;
  scenario: string;
  severity: string;
  lower: number;
  upper: number;
  weight: number;
  recovery: number;
  confidence: number;
  action: string;
}

export interface Observation {
  metric: string;
  asset: string;
  scenario: string;
  value: number;
}

export interface Assessment {
  score: number;
  rule: string;
  severity: string;
  action: string;
}
