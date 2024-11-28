import {IsEmail, IsString, IsStrongPassword} from 'class-validator';

import {User} from '@root/entities';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export class UserSigninDto {
    @IsString()
    login: User['login'];

    @IsString()
    password: User['password'];
}

export class UserSignupDto {
    @IsString()
    login: User['login'];

    @IsEmail()
    email: User['email'];

    @IsStrongPassword()
    password: User['password'];
}
