import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { EngineService } from './engine.service';
import { TelemetryGateway } from './telemetry.gateway';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [EngineService, TelemetryGateway],
})
export class AppModule {}
