import { WorkspaceRepository } from '@chat-app/entity-repository';
// import { WorkspaceRepository } from '@chat-app/entity-repository';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

import { WebsocketService } from './services/websocket.service';

@Controller()
export class AppController {
  public constructor(private websocketService: WebsocketService, private readonly workspaceRepository: WorkspaceRepository, @Inject('API') private clientProxy: ClientProxy) { }

  @EventPattern('message')
  public pubSubMessageHandler(data) {
    // this.websocketService.emitMessageToClients(data);
  }
}
