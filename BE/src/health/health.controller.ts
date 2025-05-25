import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mongooseHealthIndicator: MongooseHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health status' })
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      // MongoDB connection check
      (): Promise<HealthIndicatorResult> => this.mongooseHealthIndicator.pingCheck('mongodb'),

      // Memory usage check (heap)
      (): Promise<HealthIndicatorResult> =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 200 * 1024 * 1024),

      // Memory usage check (RSS)
      (): Promise<HealthIndicatorResult> =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 3000 * 1024 * 1024),

      // Disk storage check
      (): Promise<HealthIndicatorResult> =>
        this.diskHealthIndicator.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),

      // Application uptime
      (): Promise<HealthIndicatorResult> => this.healthService.checkUptime('uptime'),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application liveness' })
  checkLiveness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      (): Promise<HealthIndicatorResult> => this.healthService.checkLiveness('liveness'),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application readiness' })
  checkReadiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      (): Promise<HealthIndicatorResult> => this.mongooseHealthIndicator.pingCheck('mongodb'),
    ]);
  }
}
