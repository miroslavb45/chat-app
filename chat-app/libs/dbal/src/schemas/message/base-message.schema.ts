import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';

export class BaseMessage extends BaseSchema<BaseMessage>{

  @prop({
    required: true
  })
  public content: string;

  @prop({
    required: true
  })
  public createdAt: Date;
}

