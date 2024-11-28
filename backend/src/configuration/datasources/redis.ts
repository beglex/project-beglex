import {z} from 'zod';

export const redisSchema = z.object({
    host: z.string(),
    port: z.number().int(),
    password: z.string(),
});

export const redis: z.infer<typeof redisSchema> = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || '',
} as const;
