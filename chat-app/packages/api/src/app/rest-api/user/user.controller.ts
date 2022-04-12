import { User, WorkspaceUser } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { AuthorizationInterceptor, RequestDto } from '@chat-app/shared/auth';
import { Controller, Get, HttpCode, Post, Query, Req, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { WorkspaceService } from '@chat-app/shared/auth';


@Controller()
export class UserController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly userRepository: UserRepository, private readonly workspaceService: WorkspaceService) { }

  @Get('me')
  @HttpCode(200)
  public async getUserInfo(@Req() request: RequestDto): Promise<{ dbUser: User, workspaceUser: WorkspaceUser }> {

    const dbUser = await this.userRepository.findByEmail(request.dbUser.email);

    if (dbUser.activeWorkspace) {
      const workspaceUser = await this.workspaceRepository.getWorkspaceUser(request.dbUser._id, new Types.ObjectId(request.dbUser.activeWorkspace as unknown as string));

      return { dbUser: dbUser, workspaceUser: workspaceUser };
    }
    return { dbUser: dbUser, workspaceUser: null };
  }

  @UseInterceptors(AuthorizationInterceptor)
  @Post('changeName')
  @HttpCode(200)
  public async changeNameAction(@Req() request: RequestDto, @Query('name') name: string): Promise<{ name: string }> {

    if (!name) {
      throw new UnprocessableEntityException('No name provided in the payload.');
    }

    await this.workspaceRepository.updateWorkspaceUserById(request.workspaceUser._id, { displayName: name })

    return { name };
  }
}
