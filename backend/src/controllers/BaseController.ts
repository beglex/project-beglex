import {Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {ClassConstructor} from 'class-transformer';

import {ParsedQuery} from '@root/decorators';
import {Base} from '@root/entities';
import {BaseService} from '@root/services/BaseService';
import {GetManyQuery} from '@root/types';

export abstract class BaseController<T extends Base> {
    constructor(
        protected readonly service: BaseService<T>,
    ) {
    }

    abstract get Entity(): ClassConstructor<T>; // equivalent to new () => T

    @Post()
    async create(
        @Body() body: T,
    ) {
        await this.service.validate(body);

        return this.service.create(body);
    }

    @Get()
    get(
        @ParsedQuery() query: GetManyQuery<T>,
    ) {
        return this.service.get(query);
    }

    @Get(':id')
    getOne(
        @Param('id', ParseUUIDPipe) id: T['id'],
    ) {
        return this.service.getOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: T['id'],
        @Body() body: Partial<T>,
    ) {
        await this.service.validate(body, {skipMissingProperties: true});

        return this.service.update(id, body);
    }

    @Delete(':id')
    delete(
        @Param('id', ParseUUIDPipe) id: T['id'],
    ) {
        return this.service.delete(id);
    }
}
