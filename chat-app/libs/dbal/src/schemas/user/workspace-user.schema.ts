import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { Reference } from '@chat-app/utils';
import { Channel } from '../channel/channel.schema';
import { User } from './user.schema';
import { Workspace } from '../workspace/workspace.schema';

export class WorkspaceUser extends BaseSchema<WorkspaceUser> {

  @prop({
    required: true,
  })
  public baseUser: Reference<User>;

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

  @prop({
    required: false
  })
  public avatarUrl: string;


  @prop({
    required: false
  })
  public role: string; // Just a string about the role in the company, not permissions.

  @prop({
    required: true
  })
  public workspace: Reference<Workspace>; // Just a string about the role in the company, not permissions.
}
