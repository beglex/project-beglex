import {z} from 'zod';
import 'dotenv/config';

import {Environment, UserRole} from '@root/types';

import {dataSources, dataSourcesSchema} from './datasources';
import {services, servicesSchema} from './services';

const schema = z.object({
    env: z.nativeEnum(Environment),
    host: z.string().ip().or(z.literal('localhost')),
    port: z.number().int(),

    defaultUser: z.object({
        login: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.nativeEnum(UserRole),
    }),

    session: z.object({
        secret: z.string(),
        lifetime: z.number().int(),
    }),

    services: servicesSchema,

    dataSources: dataSourcesSchema,
});

export const config = schema.parse({
    env: process.env.NODE_ENV as Environment || Environment.DEVELOPMENT,
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT || 3000),

    defaultUser: {
        login: process.env.DEFAULT_USER_LOGIN || 'user',
        email: process.env.DEFAULT_USER_EMAIL || 'user@example.com',
        password: process.env.DEFAULT_USER_PASSWORD || 'password',
        role: UserRole.ADMIN,
    },

    session: {
        secret: process.env.SESSION_SECRET || 'secret',
        lifetime: Number(process.env.SESSION_LIFETIME || 3600),
    },

    services,

    dataSources,
});
