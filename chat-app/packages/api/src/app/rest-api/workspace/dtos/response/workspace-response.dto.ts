import { User } from "@chat-app/dbal";
import { Channel } from "libs/dbal/src/schemas/channel/channel.schema";

export class WorkspaceResponseDto {

  public readonly name: string;
  public readonly id: string;
  public readonly joinedUsers: Partial<User>[];
  public readonly channels: Partial<Channel>[];

}
