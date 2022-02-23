import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { Reference } from '@chat-app/utils';
import { Workspace } from '../workspace/workspace.schema';
import { Channel } from '../channel/channel.schema';

export class User extends BaseSchema<User>{

  @prop({
    required: true
  })
  public email: string;

  @prop({
    required: false
  })
  public avatarUrl: string;


  @prop({
    required: false
  })
  public role: string; // Just a string about the role in the company, not permissions.

  @prop({
    required: false
  })
  public workspace: Reference<Workspace>;

  @prop({
    required: false,
    maxlength: 300
  })
  public bio: string;

  @prop({
    required: true,
    default: []
  })
  public joinedChannels: Reference<Channel>[];
}

