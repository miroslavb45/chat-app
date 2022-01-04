import { Controller, Get, Req } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get('/hello')
  // getData(@Req() request: Request): string {
  //   return 'Hello ' + request['user']?.email + '!';
  // }


  //This works
  @Get("/message")
  async publishEvent() {
    this.appService.publishEvent();
  }

  @EventPattern('message')
  async pubSubMessageHandler(data: Record<string, unknown>) {
    console.log(data);
  }
}
