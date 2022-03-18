import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel, User } from "@chat-app/dbal";
import { Reference } from '@chat-app/utils';

@Injectable()
export class UserRepository {

  public constructor(
    @Inject(UserModel) private userModel: ModelType<User>
  ) { }

  /**
   * Saves a User entity into the database.
   * @param {Call} user
   * @return {Promise<void>}
   */
  public async create(user: User): Promise<void> {
    await this.userModel.create(user);
  }

  /**
   * Returns a User entity by email.
   * @param {string} email
   * @return {Promise<void>}
   */
  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }


  /**
   * Updates a User entity by id and payload.
   * @param {string} name
   * @return {Promise<User>}
   */
  public async updateById(user: Reference<User>, payload: Partial<User>): Promise<void> {
    return this.userModel.findOneAndUpdate({
      _id: user._id.toString()
    }, payload, { upsert: true })
  }

}
