import { User, Channel } from "@chat-app/dbal";

export class WorkspaceResponseDto {

  public readonly name: string;
  public readonly id: string;
  public readonly joinedUsers: Partial<User>[];
  public readonly channels: Partial<Channel>[];

}
