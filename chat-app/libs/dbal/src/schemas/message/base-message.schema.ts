import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { Reference } from '@chat-app/utils';
import { Workspace } from '../workspace/workspace.schema';
import { User } from '../user/user.schema';

export class Channel extends BaseSchema<Channel>{

  @prop({
    required: true
  })
  public name: string;

  @prop({
    required: true
  })
  public messages: Reference<Message>[];

  @prop({
    required: false
  })
  public workspace: Reference<Workspace>;

  @prop({
    required: true,
    default: []
  })
  public joinedUsers: Reference<User>[];


  @prop({
    required: true,
    default: []
  })
  public admins: Reference<User>[];
}


