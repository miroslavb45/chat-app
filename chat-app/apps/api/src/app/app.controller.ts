import { Controller, Get, Req } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { WebsocketService } from './services/websocket.service';

@Controller()
export class AppController {
  constructor(private websocketService: WebsocketService) { }

  @Get('/hello')
  getData(@Req() request: Request): string {
    return 'Hello ' + request['user']?.email + '!';
  }

  @EventPattern('message')
  async pubSubMessageHandler(data: any) {
    this.websocketService.emitMessageToClients(data);
  }
}
