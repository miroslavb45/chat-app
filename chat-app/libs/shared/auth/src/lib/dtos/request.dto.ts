import { User } from '@firebase/auth-types';
import { User as DbUser } from '@chat-app/dbal';

export class RequestDto {

  public readonly user: Partial<User>;
  public readonly dbUser: DbUser

}
