import { WorkspaceUser } from '@chat-app/dbal';

export class ChannelUsersResponseDto {

    public readonly users: Partial<WorkspaceUser | { availability: string }>[];

}
