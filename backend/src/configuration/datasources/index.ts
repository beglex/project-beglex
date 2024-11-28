import {z} from 'zod';

import {mongo, mongoSchema} from './mongo';
import {postgres, postgresSchema} from './postgres';
import {redis, redisSchema} from './redis';

export const dataSourcesSchema = z.object({
    postgres: postgresSchema,
    mongo: mongoSchema,
    redis: redisSchema,
});

export const dataSources = {
    postgres,
    mongo,
    redis,
} as const;
