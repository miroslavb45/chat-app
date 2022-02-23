import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  public constructor(@Inject('API') private client: ClientProxy) {

  }

  public getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  public publishEvent(message: any) {
    void this.client.emit('message', message);
  }
}
