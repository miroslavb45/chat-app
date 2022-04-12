import { UserRepository } from '@chat-app/entity-repository';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Types } from 'mongoose';
import { Observable } from "rxjs";
import { WorkspaceService } from "./workspace.service";
@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
    constructor(@Inject('WorkspaceService') private readonly workspaceService: WorkspaceService, private readonly userRepository: UserRepository) { }

    async intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        const request: any = context.switchToHttp().getRequest();

        request.workspaceUser = await this.workspaceService.getWorkspaceUser(new Types.ObjectId(request.dbUser.activeWorkspace as unknown as string), request.dbUser._id)

        if (request.workspaceUser) {
            return next.handle();
        }

        throw new UnauthorizedException('Not WorkspaceUser associated with the request User.');
    }
}