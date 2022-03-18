/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService, FirebaseService } from '@chat-app/shared/auth';
import { PreauthMiddleware } from '@chat-app/shared/auth';
import { CONFIG } from '@chat-app/shared/config';
import { ChatGateway } from './gateways/chat.gateway';
import { WebsocketService } from './services/websocket.service';
import { EntityRepositoryModule, UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { WorkspaceController } from './rest-api/workspace/workspace.controller';
import { RegisterController } from './rest-api/register/register.controller';
import { WorkspaceService } from './services/workspace.service';
import { UserController } from './rest-api/user/user.controller';
import { UserService } from './services/user.service';


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
  controllers: [AppController, WorkspaceController, RegisterController, UserController],
  providers: [AppService, AuthService, ChatGateway, FirebaseService, WebsocketService, WorkspaceService, UserService, WorkspaceRepository, UserRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).exclude(
      { path: 'api/register', method: RequestMethod.POST },
    ).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}
