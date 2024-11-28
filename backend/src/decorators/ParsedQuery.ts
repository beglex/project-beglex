import {BadRequestException, createParamDecorator, ExecutionContext} from '@nestjs/common';
import {ClassConstructor} from 'class-transformer';

import {FilterConditions, Orders} from '@root/constants/crud';
import {BaseController} from '@root/controllers/BaseController';
import {Base} from '@root/entities';
import {GetManyQuery, Search} from '@root/types/crud';

interface RawGetManyQuery {
    search?: string;
    sort?: string;
    order?: string;
    page?: string;
    limit?: string;
}

const searchOperators = Object.keys(FilterConditions);

function parseSearch<T>(search: Record<keyof T, Search>, fields: (keyof T)[]) {
    for (const [key, filters] of Object.entries<Search>(search)) {
        if (!fields.includes(key as keyof T)) {
            throw new BadRequestException(`Invalid search field: ${key}`);
        }
        if (typeof filters !== 'object' || filters === null) {
            throw new BadRequestException(`Invalid search value for field: ${key}. Expected an object.`);
        }

        for (const [op, value] of Object.entries(filters)) {
            if (!searchOperators.includes(op)) {
                throw new BadRequestException(
                    `Invalid search operator: ${op}. Must be one of "${searchOperators.join('", "')}".`);
            }
            const {type} = FilterConditions[op];
            if (type === 'string') {
                (filters as any)[op] = String(value);
            } else if (type === 'boolean') {
                (filters as any)[op] = String(value) === 'true';
            }
        }
    }
}

function parseQuery<T extends Base>(
    query: RawGetManyQuery,
    Entity: ClassConstructor<T>,
): GetManyQuery<T> {
    const {
        search: rawSearch = '{}',
        sort = 'id' as keyof T,
        order = 'ASC',
        page = '1',
        limit = '100',
    } = query as Required<RawGetManyQuery>;

    const fields = Object.keys(new Entity()) as Array<keyof T>;

    const search = JSON.parse(decodeURIComponent(rawSearch)) as GetManyQuery<T>['search'];

    if (Array.isArray(search)) {
        for (const s of search) {
            parseSearch(s, fields as string[]);
        }
    } else {
        parseSearch(search, fields as string[]);
    }

    if (!fields.includes(sort)) {
        throw new BadRequestException(`Invalid sort field: ${String(sort)}`);
    }
    if (!Orders.includes(order as typeof Orders[number])) {
        throw new BadRequestException(`Invalid order value: ${order}. Must be "${Orders.join('", "')}".`);
    }
    if (Number(limit) <= 0 || Number(page) <= 0) {
        throw new BadRequestException('Page and limit must be greater than 0');
    }

    return {
        search,
        sort,
        order: order as typeof Orders[number],
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
    };
}

export const ParsedQuery = createParamDecorator((data: unknown, ctx: ExecutionContext): GetManyQuery<any> => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const controller = ctx.getClass() as typeof BaseController;

    return parseQuery(query, controller.prototype.Entity);
});
