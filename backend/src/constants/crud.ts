export const FilterConditions: Record<string, {type: string; condition: string; quote?: string; nullable?: boolean}> = {
    eq: {type: 'string', condition: '='},
    lt: {type: 'string', condition: '<'},
    lte: {type: 'string', condition: '<='},
    gt: {type: 'string', condition: '>'},
    gte: {type: 'string', condition: '>='},
    like: {type: 'string', condition: 'LIKE', quote: '%'},
    ilike: {type: 'string', condition: 'ILIKE', quote: '%'},
    isnull: {type: 'boolean', condition: 'IS NULL', nullable: true},
} as const;

export const Orders = ['ASC', 'DESC'] as const;
