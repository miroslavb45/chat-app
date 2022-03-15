/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from '@chat-app/shared/auth';
import { PreauthMiddleware } from '@chat-app/shared/auth';
import { CONFIG } from '@chat-app/shared/config';
import { ChatGateway } from './gateways/chat.gateway';
import { WebsocketService } from './services/websocket.service';
import { EntityRepositoryModule, UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { WorkspaceController } from './rest-api/workspace/workspace.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'API', transport: Transport.REDIS,
        options: {
          url: CONFIG.redis.connectionString,
        }
      }

    ]),
    EntityRepositoryModule
  ],
  controllers: [AppController, WorkspaceController],
  providers: [AppService, ChatGateway, FirebaseService, WebsocketService, WorkspaceRepository, UserRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
