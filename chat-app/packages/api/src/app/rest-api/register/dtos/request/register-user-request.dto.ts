import { User } from '@firebase/auth-types';

export class RegisterUserRequestDto {

  public readonly user: Partial<User>;

}
