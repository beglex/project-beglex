import {Logger} from '@nestjs/common';
import {createClient, RedisClientType} from 'redis';

import {config} from '@root/configuration';

const {dataSources: {redis: {host, port, password}}} = config;

export class RedisSource {
    static #logger = new Logger(RedisSource.name);
    static #client: RedisClientType;

    static async getSource() {
        if (!this.#client) {
            this.#client = createClient({
                url: `redis://${host}:${port}`,
                password: password || undefined,
                socket: {
                    connectTimeout: 1000,
                    reconnectStrategy: attempts => (attempts > 10 ? false : Math.min(attempts * 100, 3000)),
                },
            });

            this.#client.on('error', err => this.#logger.error(err));
        }

        if (!this.#client.isReady) {
            await this.#client.connect();
        }

        return this.#client;
    }
}
