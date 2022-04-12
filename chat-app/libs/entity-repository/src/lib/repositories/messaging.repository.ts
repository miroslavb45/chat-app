import { PrivateMessage, PrivateMessageModel, WorkspaceUser } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class MessagingRepository {

  public constructor(
    @Inject(PrivateMessageModel) private privateMessageModel: ModelType<PrivateMessage>,
  ) { }

  /**
   * Saves a PrivateMessage entity into the database.
   * @param {PrivateMessage} privateMessage
   * @return {Promise<PrivateMessage>}
   */
  public async create(privateMessage: PrivateMessage): Promise<PrivateMessage> {
    return (await this.privateMessageModel.create(privateMessage));
  }

  /**
   * Returns a PrivateMessage list from the database.
   * @param {Reference<WorkspaceUser>} user1
   * @param {Reference<WorkspaceUser>} user2
   * @return {Promise<PrivateMessage[]>}
   */
  public async getPrivateMessages(user1: Reference<WorkspaceUser>, user2: Reference<WorkspaceUser>): Promise<PrivateMessage[]> {
    return await this.privateMessageModel.find({
      $or: [{
        author: user1,
        recipient: user2
      },
      {
        author: user2,
        recipient: user1
      }]
    });
  }

  /**
   * Deletes a PrivateMessage entity from the database.
   * @param {string} id
   * @return {Promise<void>}
   */
  public async deletePrivateMessage(id: string): Promise<void> {
    await this.privateMessageModel.deleteOne({ _id: id });
  }


  /**
   * Returns a PrivateMessage entity by id.
   * @param {Reference<string>} channel
   * @return {Promise<void>}
   */
  public async findById(channelId: Reference<PrivateMessage>): Promise<PrivateMessage> {
    return await this.privateMessageModel.findById(channelId);
  }

  /**
   * Updates a PrivateMessage entity by id and payload.
   * @param {Reference<PrivateMessage>} privateMessage
   * @param {Partial<PrivateMessage>} payload
   * @return {Promise<PrivateMessage>}
   */
  public async updateById(privateMessage: Reference<PrivateMessage>, payload: Partial<PrivateMessage>): Promise<PrivateMessage> {
    return this.privateMessageModel.findOneAndUpdate({
      _id: privateMessage._id.toString()
    }, payload, { upsert: true })
  }

}
