import { User } from '@firebase/auth-types';
import { User as DbUser, WorkspaceUser } from '@chat-app/dbal';

export class RequestDto {

  public user: Partial<User>;
  public dbUser: DbUser
  public workspaceUser?: WorkspaceUser

}
