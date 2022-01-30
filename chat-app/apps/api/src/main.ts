/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { IoAdapter } from '@nestjs/platform-socket.io';


import { AppModule } from './app/app.module';
import { CONFIG } from './app/config/config-provider';

class OwnAdapter extends IoAdapter {
  constructor(app: INestApplication) {
    super(app);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app))
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    methods: ["GET", "POST"],
    origin: '*',
    // transports: ['websocket', 'polling']
    credentials: true,

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
