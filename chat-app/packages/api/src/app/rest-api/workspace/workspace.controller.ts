import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { RequestDto, WorkspaceService } from '@chat-app/shared/auth';
import { ConflictException, Controller, Get, HttpCode, NotFoundException, Post, Query, Req, UnauthorizedException, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import { UserService } from '../../services/user.service';
import { WorkspaceResponseDto } from './dtos/response/workspace-response.dto';
import { WorkspacesResponseDto } from './dtos/response/workspaces-response.dto';


@Controller()
export class WorkspaceController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly userRepository: UserRepository, private readonly workspaceService: WorkspaceService, private readonly userService: UserService) { }


  @UseInterceptors(ErrorInterceptor)
  @Get('workspaces')
  @HttpCode(200)
  public async getWorkspacesAction(): Promise<WorkspacesResponseDto> {

    const workspaces = await this.workspaceRepository.getChunkOfWorkspaces();

    return { workspaces: workspaces.map(workspace => ({ id: workspace._id, name: workspace.name })) };
  }

  @Post('workspace')
  @HttpCode(200)
  public async newWorkspaceAction(@Req() request: RequestDto, @Query('name') name: string): Promise<Partial<WorkspaceResponseDto>> {

    if (!name) {
      throw new UnprocessableEntityException('No workspace name provided in the payload.');
    }
    const dbWorkspace = await this.workspaceRepository.findByName(name);

    if (dbWorkspace) {
      throw new ConflictException(`Workspace named ${name} already exists.`);
    }

    const workspace = await this.workspaceRepository.create(name);

    if (!workspace) {
      throw new Error('Workspace creation failed.')
    }

    try {
      await this.workspaceService.addUserToWorkspaceById(workspace._id, request.dbUser);
    } catch (error) {
      console.error(error)
    }

    return { name: workspace.name, id: workspace._id.toString() };
  }

  @Post('workspace/select')
  @HttpCode(200)
  public async selectWorkspaceAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<Partial<WorkspaceResponseDto>> {

    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    const dbWorkspace = await this.workspaceRepository.findById(entityId);

    if (!dbWorkspace) {
      throw new NotFoundException(`Workspace named ${dbWorkspace.name} doesn't exists.`);
    }

    try {
      const workspaceUser = await this.workspaceService.addUserToWorkspaceById(dbWorkspace._id, request.dbUser);

      await this.userService.selectWorkspace(request.dbUser, workspaceUser, dbWorkspace._id);

      return { id: dbWorkspace._id.toString(), name: dbWorkspace.name }
    } catch (error) {
      console.error(error)
    }
  }

  @Post('workspace/unselect')
  @HttpCode(200)
  public async unselectWorkspaceAction(@Req() request: RequestDto): Promise<void> {

    try {
      await this.userService.unselectWorkspace(request.dbUser);
    } catch (error) {
      console.error(error)
    }
  }

  @Get('workspace')
  @HttpCode(200)
  public async getWorkspaceAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<WorkspaceResponseDto> {

    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }
    const dbWorkspace = await this.workspaceRepository.findById(entityId);

    if (!dbWorkspace) {
      throw new ConflictException(`Workspace doesn't exist.`);
    }

    const workspaceUser = await this.workspaceRepository.getWorkspaceUser(request.dbUser._id, request.dbUser.activeWorkspace._id);

    if (!dbWorkspace.joinedUsers.includes(workspaceUser._id)) {
      throw new UnauthorizedException('User is not participating in the group.');
    }

    return { name: dbWorkspace.name, id: dbWorkspace._id.toString(), channels: dbWorkspace.channels, joinedUsers: dbWorkspace.joinedUsers };
  }

}
