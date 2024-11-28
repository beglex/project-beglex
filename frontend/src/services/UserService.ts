import type {User} from '@backend/entities';

import {BaseService} from './BaseService';

export class UserService extends BaseService<User> {
    constructor() {
        super('users');
    }

    async isAuthorized() {
        const response = await fetch(this.base, {credentials: 'include'});

        return response.ok;
    }

    async signIn(body: Pick<User, 'login' | 'password'>) {
        return this.request('signin', {method: 'POST', body: JSON.stringify(body)}) as Promise<User>;
    }

    async signUp(body: Pick<User, 'login' | 'email' | 'password'>) {
        return this.request('signup', {method: 'POST', body: JSON.stringify(body)}) as Promise<User>;
    }
}
