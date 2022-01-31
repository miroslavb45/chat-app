import { Req, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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

  constructor(private authService: FirebaseService, private appService: AppService, private websocketService: WebsocketService) {

  }

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log("WS Gateway initialized")
  }


  async handleConnection(client: Socket) {

    try {
      if (client?.handshake?.auth?.jwt) {
        const auth = await this.authService.validateToken(client.handshake.auth.jwt);

        this.websocketService.addSocket(client);
        this.appService.publishEvent({ type: 'ParticipantJoined', participant: { email: auth["email"] } })
      } else {
        console.log("Client disconnected")
        client.disconnect(true);
      }

    } catch (e) {
      client.disconnect();
      console.log(e)
    }
  }

  async handleDisconnect(client: Socket) {
    this.websocketService.removeSocket(client);
  }


  @SubscribeMessage('message')
  listenForMessages(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.appService.publishEvent(data)
  }
}