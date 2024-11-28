import {FilterConditions, Orders} from '@root/constants/crud';

export type Search = {
    [K in keyof SearchFilter]: SearchFilter[K];
};

export type SearchFilter = {
    [K in keyof typeof FilterConditions]: typeof FilterConditions[K]['type'] extends 'string'
        ? string
        : boolean;
};

export interface GetManyQuery<T> {
    search: Record<keyof T, Search> | Array<Record<keyof T, Search>>;
    sort: keyof T;
    order: typeof Orders[number];
    page: number;
    limit: number;
}

export interface GetManyResponse<T> {
    data: T[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
}
