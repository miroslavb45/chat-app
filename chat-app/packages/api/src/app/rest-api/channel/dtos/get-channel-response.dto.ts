import { Channel, ChannelMessage } from '@chat-app/dbal';
import { Reference } from '@chat-app/utils';

export class GetChannelResponseDto  {

    public name: string;

    public joinedUserNumber: number;

    public messages: Partial<ChannelMessage>[];

    public id: Reference<Channel>

}
