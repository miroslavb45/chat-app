import { User } from '@firebase/auth-types';

export class RequestDto {

  public readonly user: Partial<User>;

}
