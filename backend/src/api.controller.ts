import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EngineService } from './engine.service';
import type { Observation } from './rule.model';
import { runBatchSimulation, summarizeBatch } from './engine.service';
import type { FermentationInputs } from './engine.service';

@Controller()
export class ApiController {
  constructor(private readonly engine: EngineService) {}

  @Get('health')
  health() { return { status: 'ok', mode: 'research_demo' }; }


@Post('api/fermentation/simulate')
simulate(@Body() input: FermentationInputs) {
  try {
    const points = runBatchSimulation(input);
    return { summary: summarizeBatch(points), points };
  } catch (error) {
    throw new BadRequestException(
      error instanceof Error ? error.message : 'invalid fermentation inputs',
    );
  }
}

  @Get('api/metadata')
  metadata() {
    return {
      metrics: [
  "dissolved_oxygen_pct",
  "kla_per_hour",
  "oxygen_uptake_mmol_l_h",
  "offgas_co2_pct",
  "biomass_g_l",
  "substrate_g_l",
],
      assets: [
  "seed_bioreactor",
  "production_bioreactor",
  "sparger",
  "impeller",
  "gas_analyzer",
  "harvest_vessel",
],
      scenarios: [
  "inoculation",
  "exponential_growth",
  "feeding",
  "oxygen_limitation",
  "harvest",
  "cleaning",
],
    };
  }

  @Get('api/rules')
  rules(@Query('metric') metric?: string) { return this.engine.rules(metric); }

  @Post('api/evaluate')
  evaluate(@Body() input: Observation) {
    try {
      return this.engine.evaluate(input);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'invalid request');
    }
  }
}
