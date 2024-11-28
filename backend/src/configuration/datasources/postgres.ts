import {z} from 'zod';

export const postgresSchema = z.object({
    host: z.string(),
    port: z.number().int(),
    database: z.string(),
    user: z.string(),
    password: z.string(),
});

export const postgres: z.infer<typeof postgresSchema> = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DATABASE || '',
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
} as const;
