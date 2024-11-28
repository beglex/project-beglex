import {createHmac} from 'node:crypto';

import {Exclude, Transform} from 'class-transformer';
import {IsEmail, IsOptional, IsString, IsStrongPassword} from 'class-validator';
import {sign} from 'jsonwebtoken';
import {Column, Entity, Unique} from 'typeorm';

import {config} from '@root/configuration';
import {UserRole} from '@root/types';

import {Temporal} from './Temporal';

@Entity('user', {orderBy: {createdAt: 'ASC'}})
@Unique(['login'])
@Unique(['email'])
export class User extends Temporal {
    @Column({unique: true})
    @IsString()
    login: string;

    @Column({nullable: true})
    @IsString()
    @IsOptional()
    name?: string;

    @Column({unique: true})
    @IsEmail()
    email: string;

    @Column()
    @IsStrongPassword()
    @Exclude({toPlainOnly: true})
    password?: string;

    @Column({default: UserRole.USER})
    role: UserRole;

    @Column({name: 'last_seen', type: 'timestamp', nullable: true})
    @Transform(({value}) => new Date(value), {toClassOnly: true})
    lastSeen?: Date;

    static hashPassword(password: User['password'] = '') {
        return createHmac('sha256', password).digest('hex');
    }

    static sign({id, login}: Pick<User, 'id' | 'login'>) {
        return sign({id, login, exp: config.session.lifetime}, config.session.secret);
    }
}
