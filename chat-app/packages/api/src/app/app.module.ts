/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ChannelRepository, EntityRepositoryModule, MessagingRepository, UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { AuthService, FirebaseService, PreauthMiddleware, RedisService, WorkspaceService } from '@chat-app/shared/auth';
import { CONFIG } from '@chat-app/shared/config';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WebsocketGateway } from './gateways/websocket.gateway';
import { ChannelController } from './rest-api/channel/channel.controller';
import { MessagingController } from './rest-api/messaging/messaging.controller';
import { RegisterController } from './rest-api/register/register.controller';
import { UserController } from './rest-api/user/user.controller';
import { WorkspaceController } from './rest-api/workspace/workspace.controller';
import { ChannelService } from './services/channel.service';
import { MessagingService } from './services/messaging.service';
import { UserService } from './services/user.service';
import { VideoChatService } from './services/video-chat.service';


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
  controllers: [WorkspaceController, RegisterController, UserController, ChannelController, MessagingController],
  providers: [
    {
      provide: 'FirebaseService',
      useClass: FirebaseService,
    },
    {
      provide: 'WorkspaceService',
      useClass: WorkspaceService,
    },
    {
      provide: 'RedisService',
      useClass: RedisService,
    },
    FirebaseService, AuthService, WebsocketGateway, ChannelService, WorkspaceService, UserService, RedisService, MessagingService, VideoChatService, WorkspaceRepository, UserRepository, ChannelRepository, MessagingRepository],
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
