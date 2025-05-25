import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo(): {
    name: string;
    version: string;
    status: string;
  } {
    return {
      name: 'NestJS Backend API',
      version: '1.0.0',
      status: 'running',
    };
  }
}
