import { FactoryProvider, Module } from '@nestjs/common';
import { setGlobalOptions } from '@typegoose/typegoose';
import { UserModel, WorkspaceModel, WorkspaceUserModel } from './constants/model-names.constants';
import { DatabaseConnectorModule } from './modules/database-connector/database-connector.module';
import { createModelFromSchema } from './utils/typegoose-utils';
import { Workspace } from './schemas/workspace/workspace.schema';
import { User } from './schemas/user/user.schema';
import { WorkspaceUser } from './schemas/user/workspace-user.schema';


// Configure Typegoose
setGlobalOptions({
  globalOptions: {
    useNewEnum: true
  }
});

const mongoProviders: FactoryProvider[] = [
  { provide: WorkspaceModel, useFactory: async () => createModelFromSchema(Workspace) },
  { provide: UserModel, useFactory: async () => createModelFromSchema(User) },
  { provide: WorkspaceUserModel, useFactory: async () => createModelFromSchema(WorkspaceUser) },
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
