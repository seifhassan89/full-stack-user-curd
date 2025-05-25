/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get application metrics (for Prometheus scraping)' })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }

  @Get('system')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed system metrics (Admin only)' })
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getSystemMetrics() {
    return this.metricsService.getSystemMetrics();
  }
}
