import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TrimStringPipe } from './common/pipes/trim-string.pipe';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    abortOnError: false, // Prevent app from crashing on startup errors
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 5000);
  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

  // Security middleware
  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', configService.get('app.corsOrigins', '*')],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global pipes, filters, and interceptors
  app.useGlobalPipes(
    new TrimStringPipe(),
    new SanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(configService));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API with MongoDB and JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Enhanced graceful shutdown
  app.enableShutdownHooks();

  // Handle termination signals
  const signals = ['SIGTERM', 'SIGINT', 'SIGHUP'] as const;
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.log(`Received ${signal} signal. Starting graceful shutdown...`);

      try {
        await app.close();
        logger.log('Application shutdown complete.');
        process.exit(0);
      } catch (error) {
        logger.error(`Error during graceful shutdown: ${error.message}`, error.stack);
        process.exit(1);
      }
    });
  }

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', error => {
    logger.error('Uncaught exception:', error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  // Start server
  await app.listen(port, '0.0.0.0');
  logger.log(`Application environment: ${nodeEnv}`);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap().catch(error => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap:', error.stack);
  process.exit(1);
});
