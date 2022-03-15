import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { Reference } from '@chat-app/utils';
import { Workspace } from '../workspace/workspace.schema';

export class User extends BaseSchema<User>{
  @prop({
    required: true
  })
  public email: string;

  @prop({
    required: false
  })
  public workspaces?: Reference<Workspace>[];

}

