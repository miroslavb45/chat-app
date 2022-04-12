
import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { UserRepository } from './repositories/user.repository';

import { DbalModule } from '@chat-app/dbal';
import { ChannelRepository } from './repositories/channel.repository';
import { MessagingRepository } from './repositories/messaging.repository';

@Module({
  imports: [
    DbalModule,
  ],
  providers: [
    WorkspaceRepository,
    UserRepository,
    ChannelRepository,
    MessagingRepository
  ],
  exports: [DbalModule]
})
export class EntityRepositoryModule  {
}
