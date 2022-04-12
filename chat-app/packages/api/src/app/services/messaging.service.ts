import { PrivateMessage } from '@chat-app/dbal';
import { MessagingRepository } from '@chat-app/entity-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
  public constructor(private readonly messagingRepository: MessagingRepository) { }

  public async savePrivateMessage(channelMessage: PrivateMessage): Promise<PrivateMessage> {
    return await this.messagingRepository.create(channelMessage);
  }

  public async deletePrivateMessage(messageId: string): Promise<void> {
    await this.messagingRepository.deletePrivateMessage(messageId);
  }

  public async modifyPrivateMessage(channelMessage: PrivateMessage, newContent: string): Promise<PrivateMessage> {

    channelMessage.content = newContent;
    channelMessage.modifiedAt = new Date();

    await this.messagingRepository.updateById(channelMessage._id, channelMessage);
    return channelMessage;

  }

}

