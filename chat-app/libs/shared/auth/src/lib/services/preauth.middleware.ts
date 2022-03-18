import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {

    private defaultApp: any;

    public constructor(readonly firebaseService: FirebaseService, readonly authService: AuthService) {
        this.defaultApp = firebaseService.getDefaultApp();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    use(req: Request, res: Response, next: Function) {
        const token = req.headers.authorization;
        if (token != null && token != '') {
            this.defaultApp.auth().verifyIdToken(token.replace('Bearer ', ''))
                .then(async decodedToken => {
                    const user = {
                        email: decodedToken.email
                    }
                    req['user'] = user;

                    const dbUser = await this.authService.findUserByEmail(decodedToken.email);

                    if (!dbUser) {
                        throw new UnauthorizedException('User not found.');
                    }
                    req['dbUser'] = dbUser;

                    next();
                }).catch(error => {
                    console.error(error);
                    this.accessDenied(req.url, res);
                });
        } else {
            this.accessDenied(req.url, res);
        }
    }

    private accessDenied(url: string, res: Response) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access Denied'
        });
    }
}