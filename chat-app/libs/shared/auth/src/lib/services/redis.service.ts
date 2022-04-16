import { UserRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { CONFIG } from '@chat-app/shared/config';
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { Socket } from 'socket.io';
import { FirebaseService } from './firebase.service';




@Injectable()
export class RedisService {
    client: any;

    public constructor(private readonly authService: FirebaseService, private readonly userRepository: UserRepository, private readonly workspaceRepository: WorkspaceRepository) {

        try {
            this.client = new createClient({
                host: CONFIG.redis.host,
                port: CONFIG.redis.port,
                password: CONFIG.redis.password,
                db: CONFIG.redis.database,
                connectTimeout: CONFIG.redis.connectTimeout,
                maxRetriesPerRequest: Number.MAX_SAFE_INTEGER,
                showFriendlyErrorStack: CONFIG.isDevelopment,
                enableReadyCheck: true,
            });

            this.client.on('error', error => {
                console.error(`Failed to connect to Redis (${CONFIG.redis.host}:${CONFIG.redis.port}): ${error.message}`, null);
            });

            this.client.on('ready', () => {
                console.log(`Store connection to Redis established successfully`);
            });
        } catch (error) {
            console.error(`Failed to connect to Redis (${CONFIG.redis.host}:${CONFIG.redis.port}): ${error.message}`, null);
        }

    }



    public async addWorkspaceUserToOnlineUsers(client: Socket): Promise<{ userId: string, workspaceId: string, shouldNotify: boolean }> {
        try {
            const auth = await this.authService.validateToken(client.handshake.auth.jwt);
            const dbUser = await this.userRepository.findByEmail(auth.email);
            const workspaceUser = await this.workspaceRepository.getWorkspaceUser(dbUser._id, dbUser.activeWorkspace._id);

            const exists = await this.keyExists(`workspaceUser:${workspaceUser._id.toString()}:connections`);

            await this.addToSet(`workspaceUser:${workspaceUser._id.toString()}:connections`, client.id);


            await this.addToSet(`workspace:${workspaceUser.workspace}:onlineUsers`, workspaceUser._id.toString());


            return { userId: workspaceUser._id.toString(), workspaceId: workspaceUser.workspace._id.toString(), shouldNotify: !exists };
        } catch (error) {
            console.error(error);
        }
    }

    public async moveUserFromOnlineToInCallUsers(workspaceUserId: string, workspaceId: string): Promise<void> {
        await this.removeFromSet(`workspace:${workspaceId}:onlineUsers`, workspaceUserId);
        await this.addToSet(`workspace:${workspaceId}:inCallUsers`, workspaceUserId);
    }

    public async moveUserFromInCallToOnlineUsers(workspaceUserId: string, workspaceId: string): Promise<void> {
        await this.removeFromSet(`workspace:${workspaceId}:inCallUsers`, workspaceUserId);
        await this.addToSet(`workspace:${workspaceId}:onlineUsers`, workspaceUserId);
    }

    public async initVideoCall(user1: string, user2: string): Promise<void> {
        const callKey = `call:${[user1, user2].sort().reduce((a, c, idx) => a += `${idx === 0 ? c : `:${c}`}`, '')}`;

        if (!(await this.keyExists(callKey))) {
            this.set(callKey, 'Ringing');
        }
    }

    public async endVideoCall(user1: string, user2: string): Promise<void> {
        const callKey = `call:${[user1, user2].sort().reduce((a, c, idx) => a += `${idx === 0 ? c : `:${c}`}`, '')}`;

        if ((await this.keyExists(callKey))) {
            this.del(callKey);
        }
    }

    public async acceptVideoCall(user1: string, user2: string): Promise<void> {
        const callKey = `call:${[user1, user2].sort().reduce((a, c, idx) => a += `${idx === 0 ? c : `:${c}`}`, '')}`;

        if ((await this.keyExists(callKey))) {
            this.set(callKey, 'InCall');
        }
    }



    public async getWorkspaceUsersAvailabilities(workspaceId: string): Promise<{ onlineUsers: Set<string>, inCallUsers: Set<string> }> {

        const onlineUsers = await this.getSetElements(`workspace:${workspaceId}:onlineUsers`)
        const inCallUsers = await this.getSetElements(`workspace:${workspaceId}:inCallUsers`)

        return { onlineUsers: new Set(onlineUsers), inCallUsers: new Set(inCallUsers) };
    }

    public async removeWorkspaceUserFromOnlineUsers(wsClientId: string, workspaceId: string, workspaceUserId: string): Promise<{ workspaceId: string, userId: string, shouldNotify: boolean }> {
        try {

            await this.removeFromSet(`workspaceUser:${workspaceUserId}:connections`, wsClientId);

            const exists = await this.keyExists(`workspaceUser:${workspaceUserId}:connections`);

            if (!exists) {
                await this.removeFromSet(`workspace:${workspaceId}:onlineUsers`, workspaceUserId);
                await this.removeFromSet(`workspace:${workspaceId}:inCallUsers`, workspaceUserId);
            }

            return { workspaceId: workspaceId, userId: workspaceUserId, shouldNotify: !exists };

        } catch (error) {
            console.error(error);
        }
    }

    /**
    * Add element(s) to a set.
    * @param {string} key
    * @param {string[]} values
    * @return {Promise<number>}
    */
    public async addToSet(key: string, ...values: string[]): Promise<number> {
        return await this.client.sadd(key, ...values);
    }


    /**
    * Set key value.
    * @param {string} key
    * @param {string} value
    * @return {Promise<number>}
    */
    public async set(key: string, value: string): Promise<number> {
        return await this.client.set(key, value);
    }

    /**
    * Set key value.
    * @param {string} key
    * @param {string} value
    * @return {Promise<number>}
    */
    public async del(key: string): Promise<number> {
        return await this.client.del(key);
    }


    /**
    * Remove element(s) from a set.
    * @param {string} key
    * @param {string[]} values
    * @return {Promise<number>}
    */
    public async removeFromSet(key: string, ...values: string[]): Promise<number> {
        return await this.client.srem(key, ...values);
    }

    /**
    * @description Returns the set number of elements.
    * @param {string} key
    * @returns {Promise<number>}
    */
    public async keyExists(key: string): Promise<boolean> {
        return await new Promise((res, rej) => {
            this.client.exists(key, (err, reply) => {
                if (err) {
                    rej(err);
                }
                res(reply === 1);
            });
        })
    }

    /**
    * Checks the existence of an element in a set.
    * @param {string} key
    * @param {string[]} value
    * @return {Promise<boolean>}
    */
    public async isInSet(key: string, value: string): Promise<boolean> {
        return (await new Promise((res, rej) => {
            this.client.sismember(key, value, (err, reply) => {
                if (err) {
                    rej(err);
                }
                res(reply);
            })
        })) > 0;
    }

    /**
    * Returns the set's elements.
    * @param {string} key
    * @returns {Promise<string[]>}
    */
    public async getSetElements(key: string): Promise<string[]> {
        return await new Promise((res, rej) => {
            this.client.smembers(key, (err, reply) => {
                if (err) {
                    rej(err);
                }
                res(reply);
            })
        });
    }

}
