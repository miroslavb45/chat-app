import { Reference } from '@chat-app/utils';
import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { Channel } from '../channel/channel.schema';
import { User } from '../user/user.schema';

export class Workspace extends BaseSchema<Workspace>{

  @prop({
    required: true
  })
  public name: string;

  @prop({
    required: false,
    default: []
  })
  public channels?: Reference<Channel>[];

  @prop({
    required: false,
    default: []
  })
  public joinedUsers: Reference<User>[];

}

