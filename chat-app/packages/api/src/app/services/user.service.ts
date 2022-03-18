import { User, Workspace } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';


@Injectable()
export class UserService {


  public constructor(private readonly userRepository: UserRepository, private readonly workspaceRepository: WorkspaceRepository) { }

  public async selectWorkspace(user: User, workspace: Reference<Workspace>): Promise<void> {
    await this.userRepository.updateById(user, { activeWorkspace: workspace });
    const dbWorkspace = await this.workspaceRepository.findById(workspace._id.toString());

    if (!dbWorkspace.joinedUsers.includes(user)) {
      await this.workspaceRepository.updateById(workspace, { joinedUsers: [...dbWorkspace.joinedUsers, user._id] });
    }
  }

  public async unselectWorkspace(user: User): Promise<void> {
    await this.userRepository.updateById(user, { activeWorkspace: null });
  }
}
