import { Module } from '@nestjs/common';
import { databaseConnectionProvider } from './providers/database-connection.provider';

@Module({
  imports: [
  ],
  providers: [
    databaseConnectionProvider
  ],
  exports: [
    databaseConnectionProvider
  ]
})
export class DatabaseConnectorModule { }
