import { Inject, Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { WorkspaceModel, Workspace, WorkspaceUser, User, WorkspaceUserModel } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';
import { Types } from 'mongoose';

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
   * @param {Reference<User>} user
   * @param {Reference<WorkspaceUser>} workspaceUser
   * @return {Promise<WorkspaceUser>}
   */
  public async createWorkspaceUser(user: Reference<User>, workspace: Reference<Workspace>): Promise<WorkspaceUser> {
    return await this.workspaceUserModel.create({
      baseUser: user,
      workspace: workspace,
      role: 'User',
      displayName: 'Test Name'
    });
  }

  /**
   * Returns a WorkspaceUser entity from the database.
   * @param {Reference<User>} user
   * @param {Reference<Workspace>} workspace
   * @return {Promise<void>}
   */
  public async getWorkspaceUser(user: Reference<User>, workspace: Reference<Workspace>): Promise<WorkspaceUser> {
    return await this.workspaceUserModel.findOne({ workspace: workspace._id, baseUser: user._id });
  }

  /**
   * Returns a WorkspaceUser entity from the database.
   * @param {Reference<WorkspaceUser>} id
   * @return {Promise<WorkspaceUser>}
   */
  public async getWorkspaceUserById(id: Reference<WorkspaceUser>): Promise<WorkspaceUser> {
    return await this.workspaceUserModel.findById(id);
  }

  /**
   * Returns multiple users by object ids.
   * @param {ObjectId[]} objetIds
   * @param {boolean} lean
   * @returns {Promise<WorkspaceUser[]>}
   */
  public async getMultipleWorkspaceUser(objectIds: Types.ObjectId[], lean = true): Promise<WorkspaceUser[]> {
    return this.workspaceUserModel.find<User>({
      _id: {
        $in: [...objectIds]
      }
    }).lean(lean);
  }

  /**
   * Deletes a Workspace entity from the database.
   * @param {string} id
   * @return {Promise<void>}
   */
  public async delete(id: string): Promise<void> {
    await this.workspaceModel.deleteOne({ _id: id });
  }

  /**
   * Returns a Workspace entity by id.
   * @param {string} id
   * @return {Promise<Workspace>}
   */
  public async findById(id: string): Promise<Workspace> {
    return await this.workspaceModel.findById(id);
  }

  /**
   * Returns a WorkspaceUser entity by id.
   * @param {Reference<User>} id
   * @return {Promise<WorkspaceUser>}
   */
  public async findWorkspaceUserByUserId(id: Reference<User>): Promise<WorkspaceUser> {
    return await this.workspaceUserModel.findOne({ baseUser: id });
  }
  /**
   * Returns multiple Workspace entities by ids.
   * @param {Reference<Workspace>[]} objectIds
   * @return {Promise<Promise<DocumentType<Workspace>[]> >}
   */
  public async getMultiple(objectIds: Reference<Workspace>[], lean = true): Promise<DocumentType<Workspace>[]> {
    return this.workspaceModel.find({
      _id: {
        $in: [...objectIds]
      }
    }).lean(lean);
  }

  /**
   * Returns multiple Workspace entities by ids.
   * @param {number} chunk
   * @param {number} offset
   * @param {boolean} lean
   * @return {Promise<DocumentType<Workspace>[]> }
   */
  public async getChunkOfWorkspaces(chunk: number = 20, offset: number = 0, lean = true): Promise<DocumentType<Workspace>[]> {
    return this.workspaceModel.find({}).limit(chunk).skip(offset).lean(lean);
  }

  /**
   * Returns a Workspace entity by id.
   * @param {string} name
   * @return {Promise<Workspace>}
   */
  public async findByName(name: string): Promise<Workspace> {
    return await this.workspaceModel.findOne({ name });
  }

  /**
  * Updates a User entity by id and payload.
  * @param {Reference<Workspace>} workspace
  * @param {Partial<Workspace>} payload
  * @return {Promise<Workspace>}
  */
  public async updateById(workspace: Reference<Workspace>, payload: Partial<Workspace>): Promise<Workspace> {
    return this.workspaceModel.findOneAndUpdate({
      _id: workspace._id.toString()
    }, payload, { upsert: true })
  }

  /**
   * Updates a User entity by id and payload.
   * @param {Reference<WorkspaceUser>} workspaceUser
   * @param {Partial<WorkspaceUser>} payload
   * @return {Promise<WorkspaceUser>}
   */
  public async updateWorkspaceUserById(workspaceUser: Reference<WorkspaceUser>, payload: Partial<WorkspaceUser>): Promise<WorkspaceUser> {
    return this.workspaceUserModel.findOneAndUpdate({
      _id: workspaceUser._id.toString()
    }, payload, { upsert: true })
  }
}
