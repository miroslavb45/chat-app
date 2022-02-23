import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { WorkspaceModel, Workspace } from "@chat-app/dbal";

@Injectable()
export class WorkspaceRepository {

  public constructor(
    @Inject(WorkspaceModel) private workspaceModel: ModelType<Workspace>
  ) { }

  /**
   * Saves a Call entity into the database.
   * @param {Call} call
   * @return {Promise<void>}
   */
  public async create(workspace: Workspace): Promise<void> {
    await this.workspaceModel.create(workspace);
  }

}
