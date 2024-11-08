// src/health/health.controller.ts

import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth(@Res() res: Response) {
    const isDbConnected = await this.healthService.checkDatabaseConnection();
    if (isDbConnected) {
      return res
        .status(HttpStatus.OK)
        .json({ status: 'ok', database: 'connected' });
    } else {
      return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ status: 'error', database: 'disconnected' });
    }
  }
}
