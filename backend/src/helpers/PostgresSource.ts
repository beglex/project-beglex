import {DataSource} from 'typeorm';

import {config} from '@root/configuration';
import * as entities from '@root/entities';

const {dataSources: {postgres: {host, port, database, user: username, password}}} = config;

export class PostgresSource {
    static #source: DataSource;

    static async getSource() {
        if (!this.#source?.isInitialized) {
            this.#source = new DataSource({
                type: 'postgres', synchronize: true, host, port, username, password, database, entities,
            });
            await this.#source.initialize();
        }

        return this.#source;
    }
}
