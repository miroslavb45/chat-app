import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('API') private client: ClientProxy) {

  }

  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async publishEvent(message: string) {
    this.client.emit('message', message);
  }
}
