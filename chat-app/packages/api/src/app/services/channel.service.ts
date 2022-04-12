import { ChannelMessage, WorkspaceUser } from '@chat-app/dbal';
import { ChannelRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ChannelService {
  public constructor(private readonly channelRepository: ChannelRepository, private readonly workspaceRepository: WorkspaceRepository) { }

  public async joinChannel(workspaceUserRef: Reference<WorkspaceUser>, channelId: string): Promise<void> {

    const channelObjectId = new Types.ObjectId(channelId);

    // Update Channel's joinedUsers
    const channel = await this.channelRepository.findById(channelObjectId);

    if (!channel?.joinedUsers.includes(workspaceUserRef)) {
      await this.channelRepository.updateById(channel, { joinedUsers: [...channel.joinedUsers, workspaceUserRef] });
    }

    // Update WorkspaceUser's joinedChannels
    const workspaceUser = await this.workspaceRepository.getWorkspaceUserById(workspaceUserRef);


    if (!workspaceUser?.joinedChannels.includes(channelObjectId)) {
      await this.workspaceRepository.updateWorkspaceUserById(workspaceUser._id, { joinedChannels: [...workspaceUser?.joinedChannels, channel._id] });
    }

    console.log(`User: ${workspaceUser._id} successfully joined channel: ${channelId}`)
  }

  public async saveChannelMessage(channelMessage: ChannelMessage): Promise<ChannelMessage> {
    return await this.channelRepository.createChannelMessage(channelMessage);
  }

  public async deleteChannelMessage(messageId: string): Promise<void> {
    await this.channelRepository.deleteChannelMessage(messageId);
  }

  public async modifyChannelMessage(channelMessage: ChannelMessage, newContent: string): Promise<ChannelMessage> {

    // Update Channel's joinedUsers
    channelMessage.content = newContent;
    channelMessage.modifiedAt = new Date();

    await this.channelRepository.updateChannelMessageById(channelMessage._id, channelMessage);
    return channelMessage;

  }

}

