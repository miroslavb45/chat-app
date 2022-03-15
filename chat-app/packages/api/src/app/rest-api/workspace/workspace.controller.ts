import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { RequestDto } from '@chat-app/shared/auth';
import { Controller, Get, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { WorkspacesResponseDto } from './dtos/response/workspaces-response.dto';


@Controller()
export class WorkspaceController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly userRepository: UserRepository) { }


  @Get('workspaces')
  @HttpCode(200)
  public async getWorkspacesAction(@Req() request: RequestDto): Promise<WorkspacesResponseDto> {
    const dbUser = await this.userRepository.findByEmail(request.user.email);

    if (!dbUser) {
      throw new UnauthorizedException('User not found.');
    }

    const workspaces = await this.workspaceRepository.getMultiple(dbUser.workspaces);

    return { workspaces: workspaces.map(workspace => ({ id: workspace._id, name: workspace.name })) };
  }

}
