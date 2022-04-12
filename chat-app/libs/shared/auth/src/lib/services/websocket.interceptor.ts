import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Types } from 'mongoose';
import { Observable, of } from "rxjs";
import { Socket } from 'socket.io';
import { FirebaseService } from "./firebase.service";

@Injectable()
export class WebsocketInterceptor implements NestInterceptor {
    constructor(@Inject('FirebaseService') private readonly authService: FirebaseService, private readonly userRepository: UserRepository, private readonly workspaceRepository: WorkspaceRepository) { }

    async intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        const client: Socket = context.switchToWs().getClient();

        if (client.handshake?.auth?.jwt) {
            try {
                const auth = await this.authService.validateToken(client.handshake.auth.jwt);
                const dbUser = await this.userRepository.findByEmail(auth.email);
                const workspaceUser = await this.workspaceRepository.getWorkspaceUser(dbUser._id, new Types.ObjectId(dbUser.activeWorkspace as unknown as string));

                if (dbUser && workspaceUser) {
                    client.data.user = dbUser;
                    client.data.workspaceUser = workspaceUser;

                    return next.handle();

                } else {
                    throw new UnauthorizedException('No user associated to given JWT.')
                }

            } catch (error) {
                console.error(error)
                client.disconnect(true);
                return of(null);
            }
        } else {
            throw new UnauthorizedException('No JWT provided.')
        }
    }
}