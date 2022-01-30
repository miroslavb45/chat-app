import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './auth/auth.service';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { CONFIG } from './config/config-provider';
import { ChatGateway } from './gateways/chat.gateway';
import { WebsocketService } from './services/websocket.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'API', transport: Transport.REDIS,
        options: {
          url: CONFIG.redis.connectionString,
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, FirebaseService, WebsocketService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
