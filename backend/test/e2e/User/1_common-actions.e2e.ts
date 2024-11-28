import {faker} from '@faker-js/faker';
import {HttpStatus} from '@nestjs/common';

import {UserController} from '@root/controllers';
import {User} from '@root/entities';

import {Tester} from '../Tester';

const createPassword = () => `${faker.internet.password()}1$Aa`;

describe(`E2E: ${UserController.name}: Common actions`, () => {
    const endpoint = '/api/users';
    const {get, post, patch, del} = new Tester();

    const users: User[] = [];

    describe('Create:', () => {
        it(`POST ${endpoint} should return error for incorrect users`, async () => {
            const incorrectUsers: Partial<User>[] = [
                {login: 'incorrect1', email: 'incorrect1', password: createPassword()},
                {login: 'incorrect2', email: faker.internet.email(), password: 'password'},
                {login: 'incorrect3', password: 'password'},
                {login: 'incorrect4', email: faker.internet.email()},
            ];

            for (const user of incorrectUsers) {
                const result = await post(endpoint, user);
                const body = JSON.parse(result.text);

                expect(result.status).toEqual(HttpStatus.BAD_REQUEST);
                expect(body).toHaveProperty('message');
            }
        });

        it(`POST ${endpoint} should create user`, async () => {
            const correctUsers: Partial<User>[] = [
                {login: faker.internet.username(), email: faker.internet.email(), password: createPassword()},
                {login: faker.internet.username(), email: faker.internet.email(), password: createPassword()},
            ];

            for (const user of correctUsers) {
                const result = await post(endpoint, user);
                const body = JSON.parse(result.text) as User;

                expect(result.status).toEqual(HttpStatus.CREATED);

                users.push(body);
            }
        });

        it(`GET ${endpoint}/:id should return user`, async () => {
            for (const user of users) {
                const result = await get(`${endpoint}/${user.id}`);
                const body = JSON.parse(result.text) as User;

                expect(result.status).toEqual(HttpStatus.OK);
                expect(body).toEqual(user);
            }
        });

        it(`GET ${endpoint} should contain user`, async () => {
            const result = await get(endpoint);
            const body = JSON.parse(result.text) as User[];

            expect(result.status).toEqual(HttpStatus.OK);

            for (const user of users) {
                expect(body).toContainEqual(user);
            }
        });

        it(`POST ${endpoint} should return error in case of duplicated user`, async () => {
            const duplicatedUsers: Partial<User>[] = [
                {login: users[0].login, email: faker.internet.email(), password: createPassword()},
                {login: faker.internet.username(), email: users[0].email, password: createPassword()},
            ];

            for (const user of duplicatedUsers) {
                const result = await post(endpoint, user);

                expect(result.status).toEqual(HttpStatus.CONFLICT);
            }
        });
    });

    describe('Update:', () => {
        it(`PATCH ${endpoint}/:id should return error in case of wrong email`, async () => {
            const user: Pick<User, 'email'> = {email: faker.person.firstName()};
            const result = await patch(`${endpoint}/${users[0].id}`, user);

            expect(result.status).toEqual(HttpStatus.BAD_REQUEST);
        });

        it(`PATCH ${endpoint}/:id should return error in case of duplicated user`, async () => {
            const duplicatedUsers: Partial<User>[] = [
                {email: users[0].email},
                {login: users[0].login},
            ];

            for (const user of duplicatedUsers) {
                const result = await patch(`${endpoint}/${users[1].id}`, user);

                expect(result.status).toEqual(HttpStatus.CONFLICT);
            }
        });

        it(`PATCH ${endpoint}/:id should update user`, async () => {
            const user: Pick<User, 'name'> = {name: faker.person.fullName()};
            const result = await patch(`${endpoint}/${users[0].id}`, user);
            const body = JSON.parse(result.text) as User;

            expect(result.status).toEqual(HttpStatus.OK);

            users[0] = body;
        });
    });

    describe('Delete:', () => {
        it(`DELETE ${endpoint}/:id should delete user`, async () => {
            for (const user of users) {
                const result = await del(`${endpoint}/${user.id}`);
                const body = JSON.parse(result.text) as User;

                expect(result.status).toEqual(HttpStatus.OK);

                expect(body).toEqual(user);
            }
        });

        it(`GET ${endpoint} should not contain user`, async () => {
            const result = await get(endpoint);
            const body = JSON.parse(result.text) as User[];

            expect(result.status).toEqual(HttpStatus.OK);

            for (const user of users) {
                expect(body).not.toContain(user);
            }
        });
    });
});
