/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { IoAdapter } from '@nestjs/platform-socket.io';

import { CONFIG } from "@chat-app/shared/config";


import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './app/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  app.useWebSocketAdapter(redisIoAdapter);
  
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

  void app.startAllMicroservicesAsync();


  await app.listenAsync(port);
}

void bootstrap();
