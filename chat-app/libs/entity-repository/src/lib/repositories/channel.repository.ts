import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ChannelModel, Channel, ChannelMessage, ChannelMessageModel, Workspace, WorkspaceModel } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';

@Injectable()
export class ChannelRepository {

  public constructor(
    @Inject(ChannelModel) private channelModel: ModelType<Channel>,
    @Inject(ChannelMessageModel) private channelMessageModel: ModelType<ChannelMessage>,
    @Inject(WorkspaceModel) private workspaceModel: ModelType<Workspace>,
  ) { }

  /**
   * Saves a Channel entity into the database.
   * @param {Channel} Channel
   * @return {Promise<void>}
   */
  public async create(channel: Channel): Promise<Channel> {
    return await this.channelModel.create(channel);
  }

  /**
   * Saves a ChannelMessage entity into the database.
   * @param {ChannelMessage} channelMessage
   * @return {Promise<void>}
   */
  public async createChannelMessage(channelMessage: ChannelMessage): Promise<ChannelMessage> {
    return await this.channelMessageModel.create(channelMessage);
  }

  /**
   * Deletes a Channel entity frome the database.
   * @param {string} id
   * @return {Promise<void>}
   */
  public async deleteChannel(id: string): Promise<void> {
    await this.channelModel.deleteOne({ _id: id });
  }

  /**
   * Returns a Channel entity by id.
   * @param {Reference<Channel>} channelId
   * @return {Promise<void>}
   */
  public async findById(channelId: Reference<Channel>): Promise<Channel> {
    return await this.channelModel.findById(channelId);
  }


  /**
   * Deletes a ChannelMessage entity from the database.
   * @param {string} messageId
   * @return {Promise<void>}
   */
  public async deleteChannelMessage(messageId: string): Promise<void> {
    await this.channelMessageModel.deleteOne({ _id: messageId });
  }

  /**
   * Returns a list of Channels from a Workspace.
   * @param {Reference<Workspace>} workspaceId
   * @return {Promise<Channel[]>}
   */
  public async getWorkspaceChannels(workspaceId: Reference<Workspace>): Promise<Channel[]> {
    return ((await this.workspaceModel.aggregate([
      {
        $match: {
          _id: workspaceId
        }
      },
      {
        $lookup: {
          from: "channels",
          localField: "channels",
          foreignField: "_id",
          as: "channels_info"
        }
      },
      {
        $project: {
          channels: "$channels_info"
        }
      }
    ])) as unknown as { channels }[])[0]?.channels;
  }

  /**
   * Returns a ChannelMessage entity by id.
   * @param {Reference<ChannelMessage>} channelMessageId
   * @return {Promise<ChannelMessage>}
   */
  public async findChannelMessageById(channelMessageId: Reference<ChannelMessage>): Promise<ChannelMessage> {
    return await this.channelMessageModel.findById(channelMessageId);
  }

  /**
   * Returns a list of ChannelMessage by channel id.
   * @param {Reference<Channel>} channel
   * @return {Promise<ChannelMessage[]>}
   */
  public async getChannelMessages(channel: Reference<Channel>): Promise<ChannelMessage[]> {
    return await this.channelMessageModel.find({ channel: channel });
  }


  /**
   * Updates a Channel entity by id and payload.
   * @param {Reference<Channel>} channel
   * @param {Partial<Channel>} payload
   * @return {Promise<void>}
   */
  public async updateById(channel: Reference<Channel>, payload: Partial<Channel>): Promise<Channel> {
    return this.channelModel.findOneAndUpdate({
      _id: channel._id.toString()
    }, payload, { upsert: true })
  }

  /**
   * Updates a ChannelMessage entity by id and payload.
   * @param {Reference<ChannelMessage>} channel
   * @param {Partial<ChannelMessage>} payload
   * @return {Promise<void>}
   */
  public async updateChannelMessageById(channelMessage: Reference<ChannelMessage>, payload: Partial<ChannelMessage>): Promise<ChannelMessage> {
    return this.channelMessageModel.findOneAndUpdate({
      _id: channelMessage._id.toString()
    }, payload, { upsert: true })
  }

}
