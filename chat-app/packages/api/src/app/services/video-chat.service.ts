import { RedisService } from '@chat-app/shared/auth';
import { Injectable } from '@nestjs/common';


@Injectable()
export class VideoChatService {

  public constructor(private readonly redisService: RedisService) { }

  public async startCall(user1: string, user2: string, workspaceId: string): Promise<void> {
    // Check if the two users are in online users array
    const user1Online = await this.redisService.isInSet(`workspace:${workspaceId}:onlineUsers`, user1);
    const user2Online = await this.redisService.isInSet(`workspace:${workspaceId}:onlineUsers`, user2);

    // Move from online users to inCall users
    if (user1Online && user2Online) {
      await this.redisService.moveUserFromOnlineToInCallUsers(user1, workspaceId);
      await this.redisService.moveUserFromOnlineToInCallUsers(user2, workspaceId);
    }

    await this.redisService.initVideoCall(user1, user2);
  }

  public async acceptCall(user1: string, user2: string): Promise<void> {
    await this.redisService.acceptVideoCall(user1, user2);
  }

  public async endCall(user1: string, user2: string, workspaceId: string): Promise<void> {
    await this.redisService.endVideoCall(user1, user2);

    await this.redisService.moveUserFromInCallToOnlineUsers(user1, workspaceId);
    await this.redisService.moveUserFromInCallToOnlineUsers(user2, workspaceId);
  }

}
