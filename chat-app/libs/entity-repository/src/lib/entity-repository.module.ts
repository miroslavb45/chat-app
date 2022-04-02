
import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { UserRepository } from './repositories/user.repository';

import { DbalModule } from '@chat-app/dbal';
import { ChannelRepository } from './repositories/channel.repository';

@Module({
  imports: [
    DbalModule,
  ],
  providers: [
    WorkspaceRepository,
    UserRepository,
    ChannelRepository
  ],
  exports: [DbalModule]
})
export class EntityRepositoryModule  {
}
