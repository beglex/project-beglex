import {z} from 'zod';

export const servicesSchema = z.object({
    client: z.object({
        url: z.string(),
    }),
});

export const services: z.infer<typeof servicesSchema> = {
    client: {
        url: process.env.CLIENT_URL || 'http://localhost:8080',
    },
};
