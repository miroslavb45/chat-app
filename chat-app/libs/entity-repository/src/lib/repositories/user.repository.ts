import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel, User } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';

import { Types } from 'mongoose';

@Injectable()
export class UserRepository {

  public constructor(
    @Inject(UserModel) private userModel: ModelType<User>
  ) { }

  /**
   * Saves a User entity into the database.
   * @param {User} user
   * @return {Promise<void>}
   */
  public async create(user: User): Promise<void> {
    await this.userModel.create(user);
  }

  /**
   * Returns a User entity by email.
   * @param {string} email
   * @return {Promise<User>}
   */
  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  /**
   * Returns multiple users by object ids.
   * @param {ObjectID[]} objetIds
   * @param {boolean} lean
   * @returns {Promise<User[]>}
   */
  public async getMultiple(objectIds: Types.ObjectId[], lean = true): Promise<User[]> {
    return this.userModel.find<User>({
      _id: {
        $in: [...objectIds]
      }
    }).lean(lean);
  }


  /**
   * Updates a User entity by id and payload.
   * @param {Reference<User>} user
   * @param {Partial<User>} payload
   * @return {Promise<User>}
   */
  public async updateById(user: Reference<User>, payload: Partial<User>): Promise<User> {
    return this.userModel.findOneAndUpdate({
      _id: user._id.toString()
    }, payload, { upsert: true })
  }

}
