import { Types } from 'mongoose';

/**
 * Base schema
 * This class should be extended by all schema definition class.
 */
export abstract class BaseSchema<T extends BaseSchema<unknown>> {

  public _id?: Types.ObjectId;

  /**
   * Constructor to assign initial data to the class.
   * @param {Partial<T>} initialData
   */
  public constructor(initialData?: Partial<T>) {
    if (initialData) {
      Object.assign(this, initialData);
    }
  }

}
