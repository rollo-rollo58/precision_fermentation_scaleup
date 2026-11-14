# Precision Fermentation Scale-Up & Oxygen Transfer Workbench

**Domain:** Precision Fermentation Scale-Up & Oxygen Transfer Workbench  
**API runtime:** nestjs  
**Frontend:** Next.js App Router / TypeScript / Tailwind CSS  
**Persistence:** PostgreSQL 16 with four ordered SQL migrations.

## Purpose

This repository implements a domain-specific telemetry assessment demonstration with:

- Typed assessments scored against versioned scenario and asset policy catalogues.
- Asynchronous observations and reproducible evaluation IDs.
- A twelve-panel visual exploration interface with domain-specific dimensions.
- SQL relational storage, rollup views, audit triggers, and sample records.
- Containerized PostgreSQL and Redis for local development.

## Safety and quality boundary

Research demonstration only; synthetic rules are not certified standards. Do not use for
clinical, financial, transportation, or safety-critical decisions. The generated catalogue contains **8,840**
synthetic policy profiles, selected programmatically for development demonstrations.
Metrics and numeric bounds must be validated by a qualified domain specialist
before they can be interpreted as operational thresholds. Authentication,
observability and production deployment must undergo additional reviews.

## Scoring model

For observation x and configured interval [a, b], anomaly distance is
`max(a - x, 0, x - b) / max(b - a, 0.001)`.
The weighted score is `min(1, distance * weight * confidence)`.
The service returns the nearest relevant policy with an actionable label.

Tracked metrics:

- `dissolved_oxygen_pct`
- `kla_per_hour`
- `oxygen_uptake_mmol_l_h`
- `offgas_co2_pct`
- `biomass_g_l`
- `substrate_g_l`

Assets:

- `seed_bioreactor`
- `production_bioreactor`
- `sparger`
- `impeller`
- `gas_analyzer`
- `harvest_vessel`

Situations:

- `inoculation`
- `exponential_growth`
- `feeding`
- `oxygen_limitation`
- `harvest`
- `cleaning`

## Local development

1. Copy `.env.example` into `.env` locally and replace all example secrets.
2. Run `docker compose up -d`.
3. Apply migrations 001 through 004 using `psql` against the local database.
4. Start the backend according to the commands below.
5. Run `cd frontend && npm install && npm run dev`.

### Backend

`cd backend && npm install && npm run start:dev`

## HTTP contracts

- `GET /health` returns liveness information.
- `GET /api/metadata` returns metric, asset and scenario vocabularies.
- `POST /api/evaluate` accepts JSON `metric`, `asset`, `scenario`, `value`.
- `GET /api/rules?metric=...` exposes filtered catalogue entries when supported.
- Socket.IO emits `telemetry` messages on the API port for synthetic previews.

The frontend uses `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:8000`.
The UI can preview deterministic sample series before an API is connected.

## Structure

`backend/` contains the language-specific server and 13 policy catalogues.
`frontend/` contains twelve custom interactive domain panels.
`database/migrations/` contains tables, audit triggers, seeds, analytics.
`infra/` contains Kubernetes and monitoring configuration.

## Operational hardening checklist

- Confirm domain policies and expected units with independent domain reviewers.
- Configure TLS, signed tokens, RBAC, migrations, backups and audit retention.
- Validate data ingestion schemas, idempotency and integration contracts.
- Verify backend and frontend builds within pinned deployment images.
- Execute load, penetration, recovery, accessibility and domain acceptance tests.

## Licensing

No license is granted by default. Add an approved organizational license
before public or third-party distribution.


## Precision fermentation study notes

The simulator integrates a deliberately simplified fed-batch model:

- Specific growth: μ = μmax × S / (Ks + S) × C / (Ko + C).
- Transfer: OTR = kLa × max(Csat − C, 0), in mg oxygen/L/h.
- Consumption: OUR = X × qO2 × 32, in mg oxygen/L/h.
- Biomass change uses exponential growth over the selected time interval.
- Substrate change accounts for feed input and biomass yield.
- Oxygen is numerically bounded between zero and the estimated saturation.

The simulator does not model cell death, inhibition, foaming, gas holdup,
viscosity-dependent mixing, pH control, byproduct toxicity, pressure effects,
scale-dependent shear, organism-specific physiology, equipment safety systems,
or process qualification. It is not suitable for automatic operation of a
physical bioreactor or regulated manufacturing.

`POST /api/fermentation/simulate` accepts all parameters listed in
`FermentationInputs`. It returns `summary` and time-indexed `points`.
The frontend workbench exposes five adjustable process variables, animated
measurements in remaining panels, and a batch phase navigator.

### Architecture limitations

The 100k+ line count is dominated by mechanically generated synthetic
policy catalogue entries, not 100k separate expert-designed algorithms.
Only source-level checks and isolated numerical tests are performed in the
builder. Dependency installation, complete NestJS/Next.js builds, integration
and security certification must be completed before real deployment.

The NestJS demonstration does not yet persist its API observations to PostgreSQL.
Migrations are supplied as a domain schema reference, not as proof of a database-backed API.
