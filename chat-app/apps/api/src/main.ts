/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { CONFIG } from './app/config/config-provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    methods: ["GET", "POST"],
    origin: '*',

})
  const port = CONFIG.port || 3200;



  app.connectMicroservice(
    {
      transport: Transport.REDIS,
      options: {
        url: CONFIG.redis.connectionString,
        retryAttempts: 5,
        retryDelay: 1000
      }
    }
  )

  app.startAllMicroservicesAsync();





  await app.listenAsync(port);
}

bootstrap();
