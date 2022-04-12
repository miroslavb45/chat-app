import { Reference } from '@chat-app/utils';
import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';
import { WorkspaceUser } from '../user/workspace-user.schema';

export class BaseMessage extends BaseSchema<BaseMessage>{

  @prop({
    required: true
  })
  public content: string;

  @prop({
    required: true
  })
  public createdAt: Date;

  @prop({
    required: false,
    default: null
  })
  public modifiedAt?: Date;

  @prop({
    required: true
  })
  public author: Reference<WorkspaceUser>;
}

