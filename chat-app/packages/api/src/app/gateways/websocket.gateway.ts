import { ChannelMessage, PrivateMessage, WorkspaceUser } from '@chat-app/dbal';
import { ChannelRepository, MessagingRepository } from '@chat-app/entity-repository';
import { CacheService, WebsocketInterceptor } from '@chat-app/shared/auth';
import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChannelMessagesMessage, DeleteChannelMessagesMessage, DeletedChannelMessageMessage, JoinToChannelMessage, ModifiedChannelMessageMessage, ModifyChannelMessagesMessage, SendChannelMessagesMessage, SubscribedToChannelMessage, SubscribeToChannelMessage } from '../constants/channel-message.constants';
import { DeletedPrivateMessageMessage, DeletePrivateMessagesMessage, ModifiedPrivateMessageMessage, ModifyPrivateMessagesMessage, PrivateMessagesMessage, SendPrivateMessagesMessage, SubscribeToPrivateMessagingMessage, UserJoined, UserLeft } from '../constants/private-message-message.constants';
import { Roles } from '../constants/roles.enum';
import { DeleteChannelMessageRequestDto } from '../dtos/delete-channel-message-request.dto';
import { DeletePrivateMessageRequestDto } from '../dtos/delete-private-message-request.dto';
import { ModifyChannelMessageRequestDto } from '../dtos/modify-channel-message-request.dto';
import { ModifyPrivateMessageRequestDto } from '../dtos/modify-private-message-request.dto';
import { SendChannelMessageRequestDto } from '../dtos/send-channel-message-request.dto';
import { SendPrivateMessageRequestDto } from '../dtos/send-private-message-request.dto';
import { SubscribeChannelRequestDto } from '../dtos/subscribe-channel-request.dto';
import { SubscribeMessagingRequestDto } from '../dtos/subscribe-messaging-request.dto';
import { ChannelService } from '../services/channel.service';
import { MessagingService } from '../services/messaging.service';


@UseInterceptors(WebsocketInterceptor)
@WebSocketGateway({ cors: true })
@Injectable()
export class WebsocketGateway implements OnGatewayDisconnect, OnGatewayConnection {

  @WebSocketServer()
  private server: Server;

  public constructor(private channelService: ChannelService, private channelRepository: ChannelRepository, @Inject(forwardRef(() => CacheService)) private readonly cacheService: CacheService, private readonly messagingRepository: MessagingRepository, private readonly messagingService: MessagingService) {
  }

  public async handleDisconnect(client: Socket) {
    const { shouldNotify, userId, workspaceId } = await this.cacheService.removeWorkspaceUserFromOnlineUsers(client);

    if (shouldNotify) {
      await this.server.to(workspaceId).emit(UserLeft, { userId: userId });
    }

  }

  public async handleConnection(client: Socket) {
    const { shouldNotify, workspaceId, userId } = await this.cacheService.addWorkspaceUserToOnlineUsers(client);

    await client.join(workspaceId);

    if (shouldNotify) {
      await this.server.to(workspaceId).emit(UserJoined, { userId: userId });
    }
  }


  @SubscribeMessage(JoinToChannelMessage)
  public async joinToChannel(client: Socket, payload: SubscribeChannelRequestDto): Promise<void> {
    try {
      console.log("JOIN CHANNEL RECEIVED")
      await this.channelService.joinChannel((client.data.workspaceUser as WorkspaceUser), payload.channel);
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

  @SubscribeMessage(SubscribeToPrivateMessagingMessage)
  public async subscribeToPrivateMessaging(client: Socket, payload: SubscribeMessagingRequestDto): Promise<void> {
    try {
      console.log("SUBSCRIBE TO MESSAGING RECEIVED")

      const subscriptionKey = [client.data.workspaceUser._id.toString(), payload.userId].sort().reduce((a, c) => a += c, '');

      console.log(subscriptionKey);

      await client.join(subscriptionKey);
      client.emit(SubscribeToPrivateMessagingMessage, payload);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(SendPrivateMessagesMessage)
  public async sendPrivateMessage(client: Socket, payload: SendPrivateMessageRequestDto): Promise<void> {
    try {

      const subscriptionKey = [client.data.workspaceUser._id.toString(), payload.userId].sort().reduce((a, c) => a += c, '');

      const privateMessage: PrivateMessage = {
        content: payload.message,
        createdAt: new Date(),
        recipient: new Types.ObjectId(payload.userId),
        author: client.data.workspaceUser._id,
      };

      const savedMessage = await this.messagingService.savePrivateMessage(privateMessage);

      this.server.to(subscriptionKey).emit(PrivateMessagesMessage, savedMessage);

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
        author: client.data.workspaceUser._id,
        username: (client.data.workspaceUser as WorkspaceUser).displayName
      };

      const savedMessage = await this.channelService.saveChannelMessage(channelMessage);

      this.server.to(payload.channel).emit(ChannelMessagesMessage, savedMessage);

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(DeleteChannelMessagesMessage)
  public async deleteChannelMessage(client: Socket, payload: DeleteChannelMessageRequestDto): Promise<void> {
    try {

      const message = await this.channelRepository.findChannelMessageById(new Types.ObjectId(payload.entityId));

      if (message) {
        console.log(message.author.toString(), client.data.workspaceUser._id)

        if (client.data.workspaceUser.role === Roles.Admin || message.author.toString() === client.data.workspaceUser._id.toString()) {
          await this.channelService.deleteChannelMessage(payload.entityId);
          this.server.to(message.channel.toString()).emit(DeletedChannelMessageMessage, { channelId: message.channel, messageId: message._id });

        } else {
          throw new UnauthorizedException('Not authorized.');
        }
      } else {
        throw new NotFoundException('Message not found.');
      }

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(DeletePrivateMessagesMessage)
  public async deletePrivateMessage(client: Socket, payload: DeletePrivateMessageRequestDto): Promise<void> {
    try {

      const message = await this.messagingRepository.findById(new Types.ObjectId(payload.entityId));

      const subscriptionKey = [message.author._id.toString(), message.recipient._id.toString()].sort().reduce((a, c) => a += c, '');

      if (message) {

        if (client.data.workspaceUser.role === Roles.Admin || message.author.toString() === client.data.workspaceUser._id.toString()) {

          await this.messagingService.deletePrivateMessage(payload.entityId);
          this.server.to(subscriptionKey).emit(DeletedPrivateMessageMessage, { author: message.author, recipient: message.recipient, messageId: message._id })

        } else {
          throw new UnauthorizedException('Not authorized.');
        }
      } else {
        throw new NotFoundException('Message not found.');
      }

    } catch (error) {
      console.error(error);
    }
  }


  @SubscribeMessage(ModifyChannelMessagesMessage)
  public async modifyChannelMessage(client: Socket, payload: ModifyChannelMessageRequestDto): Promise<void> {
    try {

      const message = await this.channelRepository.findChannelMessageById(new Types.ObjectId(payload.messageId));

      if (message) {

        // Permissions
        if (client.data.workspaceUser.role === Roles.Admin || message.author.toString() === client.data.workspaceUser._id.toString()) {
          const modifiedMessage = await this.channelService.modifyChannelMessage(message, payload.content);

          this.server.to(message.channel.toString()).emit(ModifiedChannelMessageMessage, modifiedMessage);
        } else {
          throw new UnauthorizedException('Not authorized.');
        }
      } else {
        throw new NotFoundException('Message not found.');
      }

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(ModifyPrivateMessagesMessage)
  public async modifyPrivateMessage(client: Socket, payload: ModifyPrivateMessageRequestDto): Promise<void> {
    try {

      const message = await this.messagingRepository.findById(new Types.ObjectId(payload.messageId));
      const subscriptionKey = [message.author._id.toString(), message.recipient._id.toString()].sort().reduce((a, c) => a += c, '');

      if (message) {

        // Permissions
        if (client.data.workspaceUser.role === Roles.Admin || message.author.toString() === client.data.workspaceUser._id.toString()) {
          const modifiedMessage = await this.messagingService.modifyPrivateMessage(message, payload.content);

          this.server.to(subscriptionKey).emit(ModifiedPrivateMessageMessage, modifiedMessage);
        } else {
          throw new UnauthorizedException('Not authorized.');
        }
      } else {
        throw new NotFoundException('Message not found.');
      }

    } catch (error) {
      console.error(error);
    }
  }
}
