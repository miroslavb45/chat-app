import { FactoryProvider } from '@nestjs/common/interfaces';
import { connect } from 'mongoose';
import { CONFIG } from '@chat-app/shared/config';


/**
 * Provider for MongoDB database connection.
 */
export const databaseConnectionProvider: FactoryProvider = {
  provide: 'databaseConnection',
  useFactory: async () => {
    try {
      const connection = await connect(
        CONFIG.mongo.url,
        // CONFIG.mongo.connectionOptions
      );

      console.log('Database connection established successfully');

      // Set strict mode for the whole connection
      connection.set('strict', 'throw');
      // connection.set('useFindAndModify', false);

      return connection;
    } catch (error) {
      // logger.emergency(`Database connection failed: ${error.message}`, error.stack);
      console.log(error)
    }
  }
};
