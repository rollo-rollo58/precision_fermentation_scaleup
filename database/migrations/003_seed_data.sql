BEGIN;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('seed_bioreactor', 'precision_fermentation_scaleup-demo-01',
        '{"simulation": true, "tier": 1}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('production_bioreactor', 'precision_fermentation_scaleup-demo-02',
        '{"simulation": true, "tier": 2}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('sparger', 'precision_fermentation_scaleup-demo-03',
        '{"simulation": true, "tier": 3}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('impeller', 'precision_fermentation_scaleup-demo-04',
        '{"simulation": true, "tier": 4}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('gas_analyzer', 'precision_fermentation_scaleup-demo-05',
        '{"simulation": true, "tier": 5}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('harvest_vessel', 'precision_fermentation_scaleup-demo-06',
        '{"simulation": true, "tier": 6}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'dissolved_oxygen_pct', 1.23, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'kla_per_hour', 2.46, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'oxygen_uptake_mmol_l_h', 3.69, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'offgas_co2_pct', 4.92, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'biomass_g_l', 6.15, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'substrate_g_l', 7.38, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
COMMIT;
