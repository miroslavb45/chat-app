import { CONFIG } from "@chat-app/shared/config";
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RedisIoAdapter } from './app/adapters/redis-io.adapter';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    methods: 'GET, POST',
    origin: true,
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
