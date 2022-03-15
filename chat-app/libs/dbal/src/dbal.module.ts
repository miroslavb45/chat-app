import { FactoryProvider, Module, OnModuleInit } from '@nestjs/common';
import { setGlobalOptions } from '@typegoose/typegoose';
import { UserModel, WorkspaceModel } from './constants/model-names.constants';
import { DatabaseConnectorModule } from './modules/database-connector/database-connector.module';
import { createModelFromSchema } from './utils/typegoose-utils';
import { Workspace } from './schemas/workspace/workspace.schema';
import { User } from './schemas/user/user.schema';


// Configure Typegoose
setGlobalOptions({
  globalOptions: {
    useNewEnum: true
  }
});

const mongoProviders: FactoryProvider[] = [
  { provide: WorkspaceModel, useFactory: async () => createModelFromSchema(Workspace) },
  { provide: UserModel, useFactory: async () => createModelFromSchema(User) },
];

@Module({
  imports: [
    DatabaseConnectorModule,
  ],
  providers: [
    ...mongoProviders
  ],
  exports: [
    DatabaseConnectorModule,
    ...mongoProviders
  ]
})
export class DbalModule {
}
