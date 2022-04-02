import { FactoryProvider, Module } from '@nestjs/common';
import { setGlobalOptions } from '@typegoose/typegoose';
import { ChannelMessageModel, ChannelModel, PrivateMessageModel, UserModel, WorkspaceModel, WorkspaceUserModel } from './constants/model-names.constants';
import { DatabaseConnectorModule } from './modules/database-connector/database-connector.module';
import { createModelFromSchema } from './utils/typegoose-utils';
import { Workspace } from './schemas/workspace/workspace.schema';
import { User } from './schemas/user/user.schema';
import { WorkspaceUser } from './schemas/user/workspace-user.schema';
import { Channel } from './schemas/channel/channel.schema';
import { PrivateMessage } from './schemas/message/private-message.schema';
import { ChannelMessage } from './schemas/message/channel-message.schema';


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
  { provide: ChannelModel, useFactory: async () => createModelFromSchema(Channel) },
  { provide: ChannelMessageModel, useFactory: async () => createModelFromSchema(ChannelMessage) },
  { provide: PrivateMessageModel, useFactory: async () => createModelFromSchema(PrivateMessage) },
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
