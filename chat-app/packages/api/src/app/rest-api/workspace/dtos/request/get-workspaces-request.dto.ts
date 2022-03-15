import { User } from '@firebase/auth-types';

export class GetWorkspacesRequestDto {

  public readonly user: Partial<User>;

}
