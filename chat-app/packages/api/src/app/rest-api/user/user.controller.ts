import { User } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { RequestDto } from '@chat-app/shared/auth';
import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { WorkspaceService } from '../../services/workspace.service';
import { UserInfoResponseDto } from './dtos/user-info-response.dto';


@Controller()
export class UserController {
  public constructor(private readonly workspaceRepository: WorkspaceRepository, private readonly userRepository: UserRepository, private readonly workspaceService: WorkspaceService) { }

  @Get('me')
  @HttpCode(200)
  public getUserInfo(@Req() request: RequestDto): User {
    return request.dbUser;
  }
}
