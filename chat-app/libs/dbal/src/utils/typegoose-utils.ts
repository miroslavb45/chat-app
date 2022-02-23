import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { getDiscriminatorModelForClass, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { connection } from 'mongoose';

// Collection of registered Typegoose model classes. This should be defined in the top of the file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TypegooseModels: ReturnModelType<any>[] = [];

/**
 * Creates a model object from the provided Typegoose schema definition and syncs the defined indexes.
 * The second optional parameter is the parent class which will be extended by the discriminator schema.
 * @param {T} schemaDefinition
 * @param {Constructor} parentSchema
 * @returns {ModelType<T>}
 */

export async function createModelFromSchema<T extends Constructor<unknown>>(schemaDefinition: T, parentSchema?: Constructor<unknown>): Promise<ReturnModelType<T>> {
  return new Promise((resolve) => {
    // Wait until the connection has been established
    const interval = setInterval(async () => {
      // istanbul ignore else
      if (connection.readyState === 1) { // Connected state
        clearInterval(interval);

        let constructedModel;

        if (parentSchema) {
          const discriminatedModel = getModelForClass(parentSchema);
          constructedModel = getDiscriminatorModelForClass(discriminatedModel, schemaDefinition);
        } else {
          constructedModel = getModelForClass(schemaDefinition);
          await constructedModel.syncIndexes();
        }

        TypegooseModels.push(constructedModel);

        resolve(constructedModel);
      }
    }, 200);

  });

}
