import { Reference } from '@chat-app/utils';
import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { ChannelMessage } from '../message/channel-message.schema';
import { WorkspaceUser } from '../user/workspace-user.schema';
import { Workspace } from '../workspace/workspace.schema';

export class Channel extends BaseSchema<Channel>{

  @prop({
    required: true
  })
  public name: string;

  @prop({
    required: true
  })
  public author: Reference<WorkspaceUser>;

  @prop({
    required: true,
    default: []
  })
  public messages?: Reference<ChannelMessage>[];

  @prop({
    required: false
  })
  public workspace: Reference<Workspace>;

  @prop({
    required: true,
    default: []
  })
  public joinedUsers?: Reference<WorkspaceUser>[];

  @prop({
    required: true,
    default: []
  })
  public admins?: Reference<WorkspaceUser>[];
}


