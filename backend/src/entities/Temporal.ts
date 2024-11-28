import {Transform} from 'class-transformer';
import {CreateDateColumn, Entity, UpdateDateColumn} from 'typeorm';

import {Base} from './Base';

@Entity()
export abstract class Temporal extends Base {
    @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    @Transform(({value}) => new Date(value), {toClassOnly: true})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
    @Transform(({value}) => new Date(value), {toClassOnly: true})
    updatedAt: Date;
}
