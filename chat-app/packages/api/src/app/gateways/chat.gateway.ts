import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import { FirebaseService } from '../auth/auth.service';
import { WebsocketService } from '../services/websocket.service';


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {

  public constructor(private authService: FirebaseService, private appService: AppService, private websocketService: WebsocketService) {

  }

  @WebSocketServer()
  private server: Server;

  public afterInit() {
    console.log("WS Gateway initialized")
  }


  public async handleConnection(client: Socket) {

    try {
      if (client?.handshake?.auth?.jwt) {
        const auth = await this.authService.validateToken(client.handshake.auth.jwt);

        this.websocketService.addSocket(client);
        void this.appService.publishEvent({ type: 'ParticipantJoined', participant: { email: auth["email"] } })
      } else {
        console.log("Client disconnected")
        client.disconnect(true);
      }

    } catch (e) {
      client.disconnect();
      console.log(e)
    }
  }

  public handleDisconnect(client: Socket) {
    this.websocketService.removeSocket(client);
  }


  @SubscribeMessage('message')
  public listenForMessages(@MessageBody() data) {
    void this.appService.publishEvent(data)
  }
}
