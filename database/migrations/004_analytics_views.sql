BEGIN;
CREATE OR REPLACE VIEW metric_coverage AS
SELECT metric, COUNT(*) AS observation_count,
       COUNT(DISTINCT asset_id) AS distinct_assets,
       MIN(observed_at) AS first_sample,
       MAX(observed_at) AS latest_sample,
       AVG(value) AS arithmetic_mean,
       STDDEV_SAMP(value) AS sample_standard_deviation
FROM observations
GROUP BY metric;
CREATE OR REPLACE VIEW assessment_daily_rollup AS
SELECT date_trunc('day', created_at) AS day,
       severity,
       COUNT(*) AS assessment_count,
       AVG(score) AS average_score,
       MAX(score) AS peak_score
FROM assessments
GROUP BY date_trunc('day', created_at), severity;
CREATE OR REPLACE VIEW asset_observation_freshness AS
SELECT a.id, a.asset_kind, a.name,
       MAX(o.observed_at) AS last_observed_at,
       EXTRACT(EPOCH FROM now() - MAX(o.observed_at)) AS age_seconds
FROM assets a LEFT JOIN observations o ON o.asset_id = a.id
GROUP BY a.id, a.asset_kind, a.name;
COMMIT;
