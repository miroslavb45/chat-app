import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel, User } from '@chat-app/dbal';

@Injectable()
export class AuthService {

  /**
   * @param {Model<User>} userModel
   */
  public constructor(
    @Inject(forwardRef(() => UserModel)) private readonly userModel: ModelType<User>) { }

  /**
   * Find the user in database based on the JWT.
   * @param {string} email
   * @returns {Promise<User>}
   */
  public async findUserByEmail(email: string): Promise<DocumentType<User>> {
    return this.userModel.findOne({
      email    
    });
  }
}
