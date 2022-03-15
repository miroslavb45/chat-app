
import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { UserRepository } from './repositories/user.repository';

import { DbalModule } from '@chat-app/dbal';

@Module({
  imports: [
    DbalModule,
  ],
  providers: [
    WorkspaceRepository,
    UserRepository
  ],
  exports: [DbalModule]
})
export class EntityRepositoryModule  {
}
