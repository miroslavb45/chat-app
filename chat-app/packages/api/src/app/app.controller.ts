import { WorkspaceRepository } from '@chat-app/entity-repository';
// import { WorkspaceRepository } from '@chat-app/entity-repository';
import { Controller, Get, Req } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { WebsocketService } from './services/websocket.service';

@Controller()
export class AppController  {
  public constructor(private websocketService: WebsocketService, private readonly workspaceRepository: WorkspaceRepository) { }

  @Get('/hello')
  public getData(@Req() request: any): string {
    return 'Hello ' + request['user']?.email + '!';
  }

  @EventPattern('message')
  public pubSubMessageHandler(data: any) {
    this.websocketService.emitMessageToClients(data);
  }
}
