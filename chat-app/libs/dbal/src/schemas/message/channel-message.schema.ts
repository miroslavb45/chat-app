import { Reference } from '@chat-app/utils';
import { prop } from '@typegoose/typegoose';
import { Channel } from '../channel/channel.schema';
import { BaseMessage } from './base-message.schema';

export class ChannelMessage extends BaseMessage {
  @prop({
    required: true
  })
  public channel: Reference<Channel>;

  @prop({
    required: true
  })
  public username: string;
}
