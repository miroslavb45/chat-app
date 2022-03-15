import { Inject, Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { WorkspaceModel, Workspace } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';

@Injectable()
export class WorkspaceRepository {


  public constructor(
    @Inject(WorkspaceModel) private workspaceModel: ModelType<Workspace>
  ) { }

  /**
   * Saves a Workspace entity into the database.
   * @param {Workspace} workspace
   * @return {Promise<void>}
   */
  public async create(workspace: Workspace): Promise<void> {
    await this.workspaceModel.create(workspace);
  }

  /**
   * Deletes a Workspace entity frome the database.
   * @param {string} workspace
   * @return {Promise<void>}
   */
  public async delete(id: string): Promise<void> {
    await this.workspaceModel.deleteOne({ _id: id });
  }

  /**
   * Returns a Workspace entity by id.
   * @param {string} id
   * @return {Promise<void>}
   */
  public async findById(id: string): Promise<void> {
    await this.workspaceModel.findById(id);
  }

  /**
   * Returns multiple Workspace entities by ids.
   * @param {string} id
   * @return {Promise<void>}
   */
  public async getMultiple(objectIds: Reference<Workspace>[], lean = true): Promise<DocumentType<Workspace>[]> {
    return this.workspaceModel.find({
      _id: {
        $in: [...objectIds]
      }
    }).lean(lean);
  }
}
