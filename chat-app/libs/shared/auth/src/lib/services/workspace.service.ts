import { User, Workspace, WorkspaceUser } from '@chat-app/dbal';
import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';


@Injectable()
export class WorkspaceService {

  public constructor(private workspaceRepository: WorkspaceRepository, private userRepository: UserRepository) { }


  public createWorkspace(name: string): Promise<Workspace> {
    return this.workspaceRepository.create(name);
  }

  public async addUserToWorkspaceById(workspace: Reference<Workspace>, user: User): Promise<WorkspaceUser> {
    if (!user.workspaces.includes(workspace)) {
      // Attach user to the workspace
      await this.userRepository.updateById(user, {
        workspaces: [...user.workspaces, workspace._id]
      })

      // Create the WorkspaceUser
      return await this.workspaceRepository.createWorkspaceUser(user._id, workspace);
    } else {
      return this.getWorkspaceUser(workspace._id, user._id);
    }
  };

  public async getWorkspaceUser(workspaceId: Reference<Workspace>, user: Reference<User>): Promise<WorkspaceUser> {
    const workspaceUser = await this.workspaceRepository.getWorkspaceUser(user, workspaceId);
    return workspaceUser;

  }
}
