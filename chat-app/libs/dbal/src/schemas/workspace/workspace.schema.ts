import { prop } from '@typegoose/typegoose';
import { BaseSchema } from '../base.schema';

export class Workspace extends BaseSchema<Workspace>{

  @prop({
    required: true
  })
  public name: string;

}

