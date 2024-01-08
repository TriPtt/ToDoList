// metrics.service.ts
import { Injectable } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestCounter: promClient.Counter;

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    this.httpRequestCounter = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path'],
    });
  }

  public incrementHttpRequests(method: string, path: string) {
    this.httpRequestCounter.inc({ method, path });
  }

  // Add other metric-related methods as needed
}
