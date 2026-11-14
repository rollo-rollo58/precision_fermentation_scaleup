import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class TelemetryGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer() server!: Server;
  private tick = 0;
  private timer?: ReturnType<typeof setInterval>;
  private readonly metrics = [
    'dissolved_oxygen_pct', 'kla_per_hour', 'oxygen_uptake_mmol_l_h',
    'offgas_co2_pct', 'biomass_g_l', 'substrate_g_l',
  ];

  onModuleInit(): void {
    this.timer = setInterval(() => this.broadcastFrame(), 1500);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private broadcastFrame(): void {
    this.tick += 1;
    if (!this.server) return;
    this.metrics.forEach((metric, index) => {
      const value = 4.5 + Math.sin(this.tick / 9 + index) * 1.25;
      this.server.emit('telemetry', { metric, value });
    });
  }
}
