import { PrivateMessage } from '@chat-app/dbal';

export class MessagingResponseDto {

    public readonly recipient: { id: string, name: string };
    public readonly messages: PrivateMessage[];

}
