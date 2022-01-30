import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';


@Injectable()
export class WebsocketService {
    public connectedWebsocketClients: Set<Socket> = new Set();

    public addSocket(socket: Socket) {
        this.connectedWebsocketClients.add(socket);
    }

    public removeSocket(socket: Socket) {
        this.connectedWebsocketClients.delete(socket);
    }

    public emitMessageToClients(message: string) {
        this.connectedWebsocketClients.forEach(client => {
            client.emit('message', message);
            console.log(`Message sent to: ${client.id}`)
        })
    }

}
