import type {GetManyQuery} from '@backend/types';

export function toQueryString<T>(query: Partial<GetManyQuery<T>>): string {
    const {search, sort, order, page, limit} = query;

    const q = {} as any;
    if (search) {
        q.search = encodeURIComponent(JSON.stringify(search));
    }
    if (sort) {
        q.sort = String(sort);
    }
    if (order) {
        q.order = order;
    }
    if (page) {
        q.page = String(page);
    }
    if (limit) {
        q.limit = String(limit);
    }

    return new URLSearchParams(q).toString();
}
