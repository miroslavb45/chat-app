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
   * Saves a Channel entity into the database.
   * @param {Channel} Channel
   * @return {Promise<void>}
   */
  public async createChannelMessage(channelMessage: ChannelMessage): Promise<ChannelMessage> {
    return await this.channelMessageModel.create(channelMessage);
  }

  /**
   * Deletes a Channel entity into the database.
   * @param {ChannelMessage} channelMessage
   * @return {Promise<void>}
   */
  public async deleteChannel(id: string): Promise<void> {
    await this.channelModel.deleteOne({ _id: id });
  }

  /**
   * Returns a Channel entity by id.
   * @param {Reference<string>} channel
   * @return {Promise<void>}
   */
  public async findById(channelId: Reference<Channel>): Promise<Channel> {
    return await this.channelModel.findById(channelId);
  }


  /**
   * Deletes a Channel entity into the database.
   * @param {ChannelMessage} channelMessage
   * @return {Promise<void>}
   */
  public async deleteChannelMessage(messageId: string): Promise<void> {
    await this.channelMessageModel.deleteOne({ _id: messageId });
  }

  /**
   * Returns a list of Channels from a Workspace.
   * @param {Reference<Channel>} channel
   * @return {Promise<void>}
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
   * @param {Reference<Channel>} channel
   * @return {Promise<void>}
   */
  public async findChannelMessageById(id: Reference<ChannelMessage>): Promise<ChannelMessage> {
    return await this.channelMessageModel.findById(id);
  }

  /**
   * Returns a ChannelMessage entity by id.
   * @param {Reference<Channel>} channel
   * @return {Promise<void>}
   */
  public async getChannelMessages(channel: Reference<Channel>): Promise<ChannelMessage[]> {
    return await this.channelMessageModel.find({ channel: channel });
  }


  /**
   * Updates a Channel entity by id and payload.
   * @param {Reference<Channel>} channel
   * @param {Partial<Channel>} payload
   * @return {Promise<Channel>}
   */
  public async updateById(channel: Reference<Channel>, payload: Partial<Channel>): Promise<void> {
    return this.channelModel.findOneAndUpdate({
      _id: channel._id.toString()
    }, payload, { upsert: true })
  }

  /**
   * Updates a ChannelMessage entity by id and payload.
   * @param {Reference<Channel>} channel
   * @param {Partial<Channel>} payload
   * @return {Promise<Channel>}
   */
  public async updateChannelMessageById(channelMessage: Reference<ChannelMessage>, payload: Partial<ChannelMessage>): Promise<void> {
    return this.channelMessageModel.findOneAndUpdate({
      _id: channelMessage._id.toString()
    }, payload, { upsert: true })
  }

}
