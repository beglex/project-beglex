import {z} from 'zod';

export const mongoSchema = z.object({
    host: z.string(),
    port: z.number().int(),
    database: z.string(),
    user: z.string(),
    password: z.string(),
});

export const mongo: z.infer<typeof mongoSchema> = {
    host: process.env.MONGO_HOST || 'localhost',
    port: Number(process.env.MONGO_PORT || 27017),
    database: process.env.MONGO_DATABASE || '',
    user: process.env.MONGO_USER || '',
    password: process.env.MONGO_PASSWORD || '',
} as const;
