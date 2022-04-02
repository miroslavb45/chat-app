import { User, WorkspaceUser } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { RequestDto } from '@chat-app/shared/auth';
import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { Types } from 'mongoose';
import { WorkspaceService } from '../../services/workspace.service';


@Controller()
export class UserController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly userRepository: UserRepository, private readonly workspaceService: WorkspaceService) { }

  @Get('me')
  @HttpCode(200)
  public async getUserInfo(@Req() request: RequestDto): Promise<{ dbUser: User, workspaceUser: WorkspaceUser }> {
    if (request.dbUser.activeWorkspace) {
      const workspaceUser = await this.workspaceRepository.getWorkspaceUser(request.dbUser._id, new Types.ObjectId(request.dbUser.activeWorkspace as unknown as string));

      return { dbUser: request.dbUser, workspaceUser: workspaceUser };
    }
    return { dbUser: request.dbUser, workspaceUser: null };
  }
}
