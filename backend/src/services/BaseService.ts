import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {ClassConstructor, instanceToPlain} from 'class-transformer';
import {validate, ValidatorOptions} from 'class-validator';
import {snakeCase} from 'lodash';
import {FindManyOptions, FindOneOptions, FindOptionsWhere, Not, Repository} from 'typeorm';

import {FilterConditions} from '@root/constants/crud';
import {Base} from '@root/entities';
import {GetManyQuery, GetManyResponse, SearchFilter} from '@root/types/crud';

@Injectable()
export abstract class BaseService<T extends Base> {
    private tableName: string;

    constructor(
        protected readonly repo: Repository<T>,
    ) {
        this.tableName = this.repo.metadata.tableName;
    }

    protected abstract get Entity(): ClassConstructor<T>; // equivalent to new () => T

    private async getExisting(body: Partial<T>, id?: T['id']) {
        const fields = [...new Set(this.repo.metadata.uniques.flatMap(u => u.columns).map(c => c.propertyName))];
        const where: FindOptionsWhere<T>[] = fields.filter(f => body[f] !== undefined)
            .map(f => ({[f]: body[f]} as Record<string, T[string]>));

        if (id) {
            const result = await this.repo.find({where});
            return result.find(e => e.id !== id);
        } else {
            return this.repo.findOne({where});
        }
    }

    async validate(body: T | Partial<T>, options: ValidatorOptions = {}) {
        const errors = await validate(Object.assign(new this.Entity(), body), options);
        if (errors.length > 0) {
            const constraints = errors.flatMap(e => Object.values(e.constraints || {}));

            throw new BadRequestException(constraints);
        }
    }

    async create(body: Omit<T, 'id'>) {
        const existing = await this.getExisting(body as Partial<T>);
        if (existing) {
            throw new ConflictException(`${this.Entity.name} already exists`);
        }

        const result = await this.repo.save(body as T);

        return this.getOne(result.id);
    }

    async getOne(id: T['id']) {
        const result = await this.repo.findOne({where: {id}} as FindManyOptions<T>);

        return instanceToPlain(result) as T;
    }

    async get(query: GetManyQuery<T>): Promise<GetManyResponse<T>> {
        const {search, sort, order, page, limit} = query as Required<GetManyQuery<T>>;
        const offset = (page - 1) * limit;

        const qb = this.repo.createQueryBuilder(this.tableName);

        if (Array.isArray(search)) {
            for (const s of search) {
                for (const [field, filter] of Object.entries(s)) {
                    const column = `${this.tableName}.${snakeCase(field)}`;

                    for (const [op, value] of Object.entries(filter)) {
                        if (!(op in FilterConditions)) {
                            continue;
                        }

                        const {condition, quote, nullable} = FilterConditions[op as keyof SearchFilter];
                        const search = quote ? `${quote}${value}${quote}` : nullable ? null : value;
                        qb.orWhere(`${column} ${condition} :${field}`, {[field]: search});
                    }
                }
            };
        } else {
            for (const [field, filter] of Object.entries(search)) {
                const column = `${this.tableName}.${snakeCase(field)}`;

                for (const [op, value] of Object.entries(filter)) {
                    if (!(op in FilterConditions)) {
                        continue;
                    }

                    const {condition, quote, nullable} = FilterConditions[op as keyof SearchFilter];
                    const search = quote ? `${quote}${value}${quote}` : nullable ? null : value;
                    qb.andWhere(`${column} ${condition} :${field}`, {[field]: search});
                }
            }
        }

        qb.orderBy(snakeCase(String(sort)), order);

        qb.skip(offset).take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            data: instanceToPlain(data) as T[],
            count: data.length,
            total,
            page: Number.parseInt(`${page}`),
            pageCount: Math.ceil(total / limit),
        };
    }

    async update(id: T['id'], body: Partial<T>) {
        const entity = await this.getOne(id);
        if (!entity) {
            throw new NotFoundException(`${this.Entity.name} does not exist`);
        }

        const existing = await this.getExisting(body, id);
        if (existing) {
            throw new ConflictException(`${this.Entity.name} already exists`);
        }

        await this.repo.update(id, {...entity, ...body});

        return this.getOne(id);
    }

    async delete(id: T['id']) {
        const entity = await this.getOne(id);
        if (!entity) {
            throw new NotFoundException(`${this.Entity.name} does not exist`);
        }

        await this.repo.delete(id);

        return entity;
    }

    async find(options?: FindManyOptions<T>) {
        return this.repo.find(options);
    }

    async findOne(options: FindOneOptions<T>) {
        return this.repo.findOne(options);
    }
}
