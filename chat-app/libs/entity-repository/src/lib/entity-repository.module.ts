
import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './repositories/workspace.repository';

import { DbalModule } from '@chat-app/dbal';

@Module({
  imports: [
    DbalModule,
  ],
  providers: [
    WorkspaceRepository
  ],
  exports: [DbalModule]
})
export class EntityRepositoryModule  {
}
