import type {Request, Response} from 'express';

import {User} from '@root/entities';

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TESTING = 'test',
}

export type ApplicationRequest = Request & {
    data: {
        user?: User;
    };
};

export type ApplicationResponse = Response;
