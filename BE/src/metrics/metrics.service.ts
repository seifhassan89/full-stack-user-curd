/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class MetricsService {
  private readonly startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  async getMetrics(): Promise<string> {
    const metrics = [];

    // Add basic app metrics
    metrics.push(`# HELP nodejs_uptime_seconds The uptime of the Node.js process in seconds`);
    metrics.push(`# TYPE nodejs_uptime_seconds counter`);
    metrics.push(`nodejs_uptime_seconds ${Math.floor((Date.now() - this.startTime) / 1000)}`);

    // Memory usage metrics
    const memoryUsage = process.memoryUsage();

    metrics.push(`# HELP nodejs_heap_size_total_bytes Total size of V8 heap in bytes`);
    metrics.push(`# TYPE nodejs_heap_size_total_bytes gauge`);
    metrics.push(`nodejs_heap_size_total_bytes ${memoryUsage.heapTotal}`);

    metrics.push(`# HELP nodejs_heap_size_used_bytes Size of used V8 heap in bytes`);
    metrics.push(`# TYPE nodejs_heap_size_used_bytes gauge`);
    metrics.push(`nodejs_heap_size_used_bytes ${memoryUsage.heapUsed}`);

    metrics.push(`# HELP nodejs_external_memory_bytes Size of external memory in bytes`);
    metrics.push(`# TYPE nodejs_external_memory_bytes gauge`);
    metrics.push(`nodejs_external_memory_bytes ${memoryUsage.external || 0}`);

    metrics.push(`# HELP nodejs_rss_bytes Resident Set Size in bytes`);
    metrics.push(`# TYPE nodejs_rss_bytes gauge`);
    metrics.push(`nodejs_rss_bytes ${memoryUsage.rss}`);

    return metrics.join('\n');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getSystemMetrics() {
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memory: process.memoryUsage(),
      cpu: {
        count: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg(),
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        hostname: os.hostname(),
        arch: os.arch(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
    };
  }
}
