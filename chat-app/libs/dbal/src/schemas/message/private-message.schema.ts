import { Reference } from '@chat-app/utils';
import { prop } from '@typegoose/typegoose';
import { WorkspaceUser } from '../user/workspace-user.schema';
import { BaseMessage } from './base-message.schema';

export class PrivateMessage extends BaseMessage {

  @prop({
    required: true
  })
  public recipient: Reference<WorkspaceUser>;
}
