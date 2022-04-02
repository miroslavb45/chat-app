import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketInterceptor } from '@chat-app/shared/auth';
import { ChannelMessagesMessage, DeleteChannelMessagesMessage, JoinToChannelMessage, ModifyChannelMessagesMessage, SendChannelMessagesMessage, SubscribedToChannelMessage, SubscribeToChannelMessage } from '../constants/channel-message.constants';
import { SubscribeChannelRequestDto } from '../dtos/subscribe-channel-request.dto';
import { UseInterceptors } from '@nestjs/common';
import { ChannelMessage, User } from '@chat-app/dbal';
import { SendChannelMessageRequestDto } from '../dtos/send-channel-message-request.dto';
import { ChannelService } from '../services/channel.service';
import { Types } from 'mongoose';
import { DeleteChannelMessageRequestDto } from '../dtos/delete-channel-message-request.dto';
import { ModifyChannelMessageRequestDto } from '../dtos/modify-channel-message-request.dto';


@UseInterceptors(WebsocketInterceptor)
@WebSocketGateway({ cors: true })
export class WebsocketGateway {

  public constructor(private channelService: ChannelService) { }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage(JoinToChannelMessage)
  public async joinToChannel(client: Socket, payload: SubscribeChannelRequestDto): Promise<void> {
    try {
      console.log("JOIN CHANNEL RECEIVED")
      await this.channelService.joinChannel((client.data.user as User)._id, payload.channel);
      await client.join(payload.channel);
      client.emit(SubscribedToChannelMessage, payload);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(SubscribeToChannelMessage)
  public async subscribeToChannel(client: Socket, payload: SubscribeChannelRequestDto): Promise<void> {
    try {
      console.log("SUBSCRIBE TO CHANNEL RECEIVED")

      await client.join(payload.channel);
      client.emit(SubscribedToChannelMessage, payload);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(SendChannelMessagesMessage)
  public async sendChannelMessage(client: Socket, payload: SendChannelMessageRequestDto): Promise<void> {
    try {

      const channelMessage: ChannelMessage = {
        content: payload.message,
        createdAt: new Date(),
        channel: new Types.ObjectId(payload.channel),
        author: client.data.user._id,
        username: (client.data.user as User).email.split('@')[0]
      };

      this.server.to(payload.channel).emit(ChannelMessagesMessage, channelMessage);

      await this.channelService.saveChannelMessage(channelMessage)

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(DeleteChannelMessagesMessage)
  public async deleteChannelMessage(client: Socket, payload: DeleteChannelMessageRequestDto): Promise<void> {
    try {

      // TODO: Permissions
      await this.channelService.deleteChannelMessage(payload.messageId)

      // TODO: Notify users about deletion;

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(ModifyChannelMessagesMessage)
  public async modifyChannelMessage(client: Socket, payload: ModifyChannelMessageRequestDto): Promise<void> {
    try {

      console.log("Modify received")
      // TODO: Permissions
      await this.channelService.modifyChannelMessage(payload.messageId, payload.content);

      // TODO: Notify users about deletion;

    } catch (error) {
      console.error(error);
    }
  }
}
