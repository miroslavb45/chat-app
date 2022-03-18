import { Inject, Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { WorkspaceModel, Workspace, WorkspaceUser, User, WorkspaceUserModel } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';

@Injectable()
export class WorkspaceRepository {


  public constructor(
    @Inject(WorkspaceModel) private workspaceModel: ModelType<Workspace>,
    @Inject(WorkspaceUserModel) private workspaceUserModel: ModelType<WorkspaceUser>
  ) { }

  /**
   * Saves a Workspace entity into the database.
   * @param {Workspace} name
   * @return {Promise<Workspace>}
   */
  public async create(name: string): Promise<Workspace> {
    return await this.workspaceModel.create({ name });
  }

  /**
   * Saves a WorkspaceUser entity into the database.
   * @param {WorkspaceUser} workspaceUser
   * @return {Promise<void>}
   */
  public async createWorkspaceUser(user: Reference<User>, workspace: Reference<Workspace>): Promise<WorkspaceUser> {
    return await this.workspaceUserModel.create({
      baseUser: user,
      workspace: workspace
    });
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
  public async findById(id: string): Promise<Workspace> {
    return await this.workspaceModel.findById(id);
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

  /**
   * Returns a Workspace entity by id.
   * @param {string} name
   * @return {Promise<void>}
   */
  public async findByName(name: string): Promise<Workspace> {
    return await this.workspaceModel.findOne({ name });
  }

  /**
 * Updates a User entity by id and payload.
 * @param {string} name
 * @return {Promise<User>}
 */
  public async updateById(workspace: Reference<Workspace>, payload: Partial<Workspace>): Promise<void> {
    return this.workspaceModel.findOneAndUpdate({
      _id: workspace._id.toString()
    }, payload, { upsert: true })
  }
}
