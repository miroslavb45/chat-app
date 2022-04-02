import { Channel, User } from '@chat-app/dbal';
import { ChannelRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { Reference } from '@chat-app/utils';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class WebsocketService {

  public constructor(private readonly channelRepository: ChannelRepository, private readonly workspaceRepository: WorkspaceRepository) { }


}

