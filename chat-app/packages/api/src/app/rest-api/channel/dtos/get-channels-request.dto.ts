import { Workspace } from '@chat-app/dbal';
import { RequestDto } from '@chat-app/shared/auth';
import { Reference } from '@chat-app/utils';

export class GetChannelsRequestDto extends RequestDto {

  public readonly workspace: Reference<Workspace>;

}
