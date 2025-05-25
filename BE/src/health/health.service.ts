import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService extends HealthIndicator {
  private readonly startTime: number;

  constructor() {
    super();
    this.startTime = Date.now();
  }

  async checkUptime(key: string): Promise<HealthIndicatorResult> {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000); // uptime in seconds
    return this.getStatus(key, true, { uptime: `${uptime}s` });
  }

  async checkLiveness(key: string): Promise<HealthIndicatorResult> {
    // A simple check to verify the application is running and can respond to requests
    return this.getStatus(key, true);
  }
}
