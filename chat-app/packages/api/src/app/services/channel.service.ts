import { User } from '@chat-app/dbal';
import { ChannelRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';
import { ChannelMessage } from 'libs/dbal/src/schemas/message/channel-message.schema';
import { Types } from 'mongoose';

@Injectable()
export class ChannelService {
  public constructor(private readonly channelRepository: ChannelRepository, private readonly workspaceRepository: WorkspaceRepository) { }

  public async joinChannel(user: Reference<User>, channelId: string): Promise<void> {

    const channelObjectId = new Types.ObjectId(channelId);

    // Update Channel's joinedUsers
    const channel = await this.channelRepository.findById(channelObjectId);

    if (!channel?.joinedUsers.includes(user)) {
      await this.channelRepository.updateById(channel, { joinedUsers: [...channel.joinedUsers, user._id] });
    }

    // Update WorkspaceUser's joinedChannels
    const workspaceUser = await this.workspaceRepository.findWorkspaceUserByUserId(user._id);

    if (!workspaceUser?.joinedChannels.includes(channelObjectId)) {
      await this.workspaceRepository.updateWorkspaceUserById(workspaceUser, { joinedChannels: [...workspaceUser.joinedChannels, channel._id] });
    }

    console.log(`User: ${user._id} successfully joined channel: ${channelId}`)
  }

  public async saveChannelMessage(channelMessage: ChannelMessage): Promise<void> {
    await this.channelRepository.createChannelMessage(channelMessage);
  }

  public async deleteChannelMessage(messageId: string): Promise<void> {
    await this.channelRepository.deleteChannelMessage(messageId);
  }

  public async modifyChannelMessage(channelMessageId: string, newContent: string): Promise<void> {
    const channelMessageObjectId = new Types.ObjectId(channelMessageId);

    // Update Channel's joinedUsers
    const channelMessage = await this.channelRepository.findChannelMessageById(channelMessageObjectId);
    channelMessage.content = newContent;
    channelMessage.modifiedAt = new Date();

    console.log(channelMessage)
    if (channelMessage) {
      await this.channelRepository.updateChannelMessageById(channelMessage._id, channelMessage)
    }
  }

}

