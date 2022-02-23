import { FactoryProvider, Module, OnModuleInit } from '@nestjs/common';
import { setGlobalOptions } from '@typegoose/typegoose';
import { WorkspaceModel } from './constants/model-names.constants';
import { DatabaseConnectorModule } from './modules/database-connector/database-connector.module';
import { createModelFromSchema } from './utils/typegoose-utils';
import { Workspace } from './schemas/workspace/workspace.schema';


// Configure Typegoose
setGlobalOptions({
  globalOptions: {
    useNewEnum: true
  }
});

const mongoProviders: FactoryProvider[] = [
  { provide: WorkspaceModel, useFactory: async () => createModelFromSchema(Workspace) },
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
