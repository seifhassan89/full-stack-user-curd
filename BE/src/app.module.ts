import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import appConfig from './config/app.config';
import mongodbConfig from './config/mongodb.config';
import jwtConfig from './config/jwt.config';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, jwtConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env', '.env.local'],
      cache: true,
      expandVariables: true,
      validate: config => {
        const { error, value } = validationSchema.validate(config, {
          abortEarly: false,
        });

        if (error) {
          const errorMessages = error.details
            .map(detail => `Environment variable ${detail.path.join('.')} - ${detail.message}`)
            .join('\n');

          console.error('\n⚠️ Environment validation errors:');
          console.error(errorMessages);
          console.error(
            '\nFix these issues in your .env file or environment variables before continuing.\n',
          );

          if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment configuration');
          }
        }

        return value;
      },
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Check if a full MongoDB URI is provided
        const mongoUri = configService.get<string>('mongodb.uri');
        if (mongoUri) {
          return {
            uri: mongoUri,
          };
        }

        // Build URI from individual components if available
        const host = configService.get<string>('MONGODB_HOST');
        const port = configService.get<number>('MONGODB_PORT', 27017);
        const database = configService.get<string>('MONGODB_DATABASE', 'nest-app');
        const username = configService.get<string>('MONGODB_USERNAME');
        const password = configService.get<string>('MONGODB_PASSWORD');

        let uri = 'mongodb://';

        // Add authentication if provided
        if (username && password) {
          uri += `${username}:${password}@`;
        }

        // Add host and port
        uri += `${host || 'localhost'}:${port}`;

        // Add database name
        uri += `/${database}`;

        return { uri };
      },
    }),

    // Throttler module for rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('app.throttleTtl', 60),
          limit: configService.get<number>('app.throttleLimit', 100),
        },
      ],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    HealthModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Enable throttler guard for rate limiting across the application
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
