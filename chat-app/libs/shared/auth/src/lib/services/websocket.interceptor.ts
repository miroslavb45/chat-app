import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { FirebaseService } from "./firebase.service";
import { Socket } from 'socket.io';
import { UserRepository } from '@chat-app/entity-repository';

@Injectable()
export class WebsocketInterceptor implements NestInterceptor {
    constructor(@Inject('FirebaseService') private readonly authService: FirebaseService, private readonly userRepository: UserRepository) { }

    async intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        const client: Socket = context.switchToWs().getClient();

        if (!client?.data?.isAuthenticated && client.handshake?.auth?.jwt) {

            try {
                const auth = await this.authService.validateToken(client.handshake.auth.jwt);
                const dbUser = await this.userRepository.findByEmail(auth.email);

                if (dbUser) {
                    client.data.user = dbUser;
                    client.data.isAuthenticated = true;
                    return next.handle();
                } else {
                    console.error('No user associated to the JWT.')
                    return of(null);
                }

            } catch (error) {
                console.error('Not valid JWT token.')
                client.disconnect(true);
                return of(null);
            }
        } else {
            return next.handle();
        }
    }
}