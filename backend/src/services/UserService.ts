import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {User} from '@root/entities';
import {UserSigninDto} from '@root/types';

import {BaseService} from './BaseService';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        protected readonly repo: Repository<User>,
    ) {
        super(repo);
    }

    protected get Entity() {
        return User;
    }

    override create(entity: Omit<User, 'id'>) {
        if (entity.password) {
            entity.password = User.hashPassword(entity.password);
        }

        return super.create(entity);
    }

    override update(id: User['id'], entity: Partial<User>) {
        if (entity.password) {
            entity.password = User.hashPassword(entity.password);
        }

        return super.update(id, entity);
    }

    async signIn({login, password}: UserSigninDto): Promise<User> {
        const user = await this.repo.findOne({where: {login}});

        if (User.hashPassword(password) === user?.password) {
            await this.repo.save({...user, lastSeen: new Date()});

            return this.getOne(user.id);
        } else {
            throw new UnauthorizedException(User.name);
        }
    }
}
