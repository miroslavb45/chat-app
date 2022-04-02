import { Channel } from '@chat-app/dbal';

export class ChannelsResponseDto {

    public readonly channels: Partial<Channel>[];

}
