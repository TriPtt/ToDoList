// metrics.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: any, res: any, next: () => void) {
    const method = req.method;
    const path = req.path;

    this.metricsService.incrementHttpRequests(method, path);
    next();
  }
}
