import { User, Workspace } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';


@Injectable()
export class WorkspaceService {

  public constructor(private workspaceRepository: WorkspaceRepository, private userRepository: UserRepository) {

  }


  public createWorkspace(name: string): Promise<Workspace> {
    return this.workspaceRepository.create(name);
  }

  public async addUserToWorkspaceById(workspace: Reference<Workspace>, user: User): Promise<void> {
    if (!user.workspaces.includes(workspace)) {
      // Attach user to the workspace
      await this.userRepository.updateById(user, {
        workspaces: [...user.workspaces, workspace._id]
      })

      // Create the WorkspaceUser
      await this.workspaceRepository.createWorkspaceUser(user._id, workspace);
    }
  };

}
