import { MessagingRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { AuthorizationInterceptor, CacheService, RequestDto } from '@chat-app/shared/auth';
import { Controller, forwardRef, Get, HttpCode, Inject, NotFoundException, Post, Query, Req, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import { MessagingService } from '../../services/messaging.service';
import { ChannelUsersResponseDto } from './dtos/channel-users-response.dto';
import { MessagingResponseDto } from './dtos/messaging-response.dto';


@UseInterceptors(ErrorInterceptor)
@Controller()
export class MessagingController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly messagingRepository: MessagingRepository, @Inject(forwardRef(() => CacheService)) private readonly cacheService: CacheService, private readonly messagingService: MessagingService) { }

  @Get('workspaceUsers')
  @HttpCode(200)
  public async getChannelsAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<ChannelUsersResponseDto> {


    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    // Check if user is in the workspace
    if (!request.dbUser.workspaces.map(ws => ws.toString()).includes(entityId)) {
      throw new UnprocessableEntityException('User is not joined to the given workspace.');
    }

    const dbWorkspace = await this.workspaceRepository.findById(entityId);

    const workspaceUsers = await this.workspaceRepository.getMultipleWorkspaceUser(dbWorkspace.joinedUsers as Types.ObjectId[]);

    const availabilities = await this.cacheService.getWorkspaceUsersAvailabilities(dbWorkspace._id.toString());

    const mappedAvailabilities = workspaceUsers.reduce((a, c) => {
      const workspaceUserId = c._id.toString();

      a.push({ name: c.displayName, id: c._id.toString(), availability: availabilities.onlineUsers.has(workspaceUserId) ? 'Online' : availabilities.inCallUsers.has(workspaceUserId) ? 'InCall' : 'Offline' });
      return a;
    }, [])

    return { users: mappedAvailabilities };
  }

  @Get('messaging')
  @UseInterceptors(AuthorizationInterceptor)
  @HttpCode(200)
  public async getChannelAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<MessagingResponseDto> {

    if (!entityId) {
      throw new UnprocessableEntityException('No user id provided in the payload.');
    }

    const targetUser = await this.workspaceRepository.getWorkspaceUserById(new Types.ObjectId(entityId));

    if (!targetUser) {
      throw new NotFoundException("Request workspace user doesn't exist.")
    }

    const messages = await this.messagingRepository.getPrivateMessages(request.workspaceUser._id, new Types.ObjectId(entityId));

    return { recipient: { id: entityId, name: targetUser.displayName }, messages };
  }

  @UseInterceptors(AuthorizationInterceptor)
  @Post('deleteMessaging')
  @HttpCode(200)
  public async deleteMessagingAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<{ _id: string }> {
    if (!entityId) {
      throw new UnprocessableEntityException('No user id provided in the payload.');
    }

    const messages = await this.messagingRepository.getPrivateMessages(request.workspaceUser._id, new Types.ObjectId(entityId));


    if (messages && !(messages.length > 0)) {
      throw new NotFoundException(`No messages found.`);
    }

    for (const message of messages) {
      await this.messagingService.deletePrivateMessage(message._id.toString());
    }


    return { _id: entityId };
  }

}
