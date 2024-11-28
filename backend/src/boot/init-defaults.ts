import {Logger} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {EntityManager} from 'typeorm';

import {config} from '@root/configuration';
import {User} from '@root/entities';
import {PostgresSource} from '@root/helpers';

export async function initDefaults() {
    Logger.verbose('Starting...', initDefaults.name);

    const source = await PostgresSource.getSource();

    const {manager} = source;

    await initUser(manager);

    Logger.verbose('Finished', initDefaults.name);
};

async function initUser(manager: EntityManager): Promise<void> {
    await manager.transaction(async (manager) => {
        const existing = await manager.findOne(User, {where: {login: config.defaultUser.login}});
        try {
            const plain = {
                ...existing || {},
                login: config.defaultUser.login,
                email: config.defaultUser.email.toLowerCase(),
                password: User.hashPassword(config.defaultUser.password),
                role: config.defaultUser.role,
            };

            await manager.save(User, plainToInstance(User, plain));

            Logger.verbose(`User ${config.defaultUser.login} created`, `${initDefaults.name}.${initUser.name}`);
        } catch (err: any) {
            throw new Error(err);
        }
    });
}
