import type {GetManyQuery, GetManyResponse} from '@backend/types';
import type {ResponseError} from '@root/types';

import {toQueryString} from '@root/utils';

export abstract class BaseService<T extends {id: string; [key: string]: any}> {
    protected base = `${process.env.NEXT_PUBLIC_API_URL}/`;

    protected headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    protected options: RequestInit = {
        headers: this.headers,
        credentials: 'include',
    };

    constructor(endpoint: string) {
        this.base += endpoint.replace(/^\//, '').replace(/\/$/, '');
    }

    private async parse(response: Response) {
        if (!response.ok) {
            const error = await response.json() as ResponseError;
            const message = Array.isArray(error.message) ? error.message[0] : error.message;
            throw new Error(message);
        }

        return response.json();
    }

    protected async request(path = '', options: RequestInit = {}) {
        const url = path ? `${this.base}/${path}` : this.base;
        const response = await fetch(url, {...this.options, ...options});

        return this.parse(response) as Promise<unknown>;
    }

    async get(query: Partial<GetManyQuery<T>> = {}, options: RequestInit = {}) {
        let url = '';
        if (Object.keys(query).length) {
            url = `?${toQueryString(query)}`;
        }

        return this.request(url, {...options, method: 'GET'}) as Promise<GetManyResponse<T>>;
    }

    async getOne(id: T['id'], options: RequestInit = {}) {
        return this.request(id, {...options, method: 'GET'}) as Promise<T>;
    }

    async create(body: Omit<T, 'id'>, options: RequestInit = {}) {
        return this.request('', {...options, method: 'POST', body: JSON.stringify(body)}) as Promise<T>;
    }

    async update(id: T['id'], body: Partial<T>, options: RequestInit = {}) {
        return this.request(id, {...options, method: 'PATCH', body: JSON.stringify(body)}) as Promise<T>;
    }

    async delete(id: T['id'], options: RequestInit = {}) {
        return this.request(id, {...options, method: 'DELETE'}) as Promise<T>;
    }
}
