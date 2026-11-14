BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_kind text NOT NULL,
    name text NOT NULL,
    properties jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(asset_kind, name)
);
CREATE TABLE IF NOT EXISTS observations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id uuid NOT NULL REFERENCES assets(id),
    metric text NOT NULL,
    value double precision NOT NULL,
    unit text NOT NULL DEFAULT 'normalized',
    source text NOT NULL DEFAULT 'simulator',
    observed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (value BETWEEN -1e12 AND 1e12)
);
CREATE INDEX observations_metric_time_idx ON observations(metric, observed_at DESC);
CREATE INDEX observations_asset_time_idx ON observations(asset_id, observed_at DESC);
CREATE TABLE IF NOT EXISTS assessments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    observation_id uuid REFERENCES observations(id),
    rule_code text NOT NULL,
    score double precision NOT NULL CHECK (score BETWEEN 0 AND 1),
    severity text NOT NULL,
    explanation text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_log (
    id bigserial PRIMARY KEY,
    subject_table text NOT NULL,
    subject_id text NOT NULL,
    operation text NOT NULL,
    actor text NOT NULL DEFAULT current_user,
    data jsonb NOT NULL,
    event_time timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX assessments_created_at_idx ON assessments(created_at DESC);
COMMIT;
