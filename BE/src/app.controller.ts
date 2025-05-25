import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SuccessApiResponse } from './common/dto/api-response/success-api-response.dto';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application information' })
  getAppInfo(): SuccessApiResponse<{ name: string; version: string; status: string }> {
    return {
      isSuccess: true,
      data: this.appService.getAppInfo(),
    };
  }
}
