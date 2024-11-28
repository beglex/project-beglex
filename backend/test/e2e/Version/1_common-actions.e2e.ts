import {HttpStatus} from '@nestjs/common';

import {VersionController} from '@root/controllers';

import {version} from '../../../package.json';
import {Tester} from '../Tester';

describe(`E2E: ${VersionController.name}: Common actions`, () => {
    const endpoint = '/api/version';
    const {get} = new Tester();

    it(`GET ${endpoint}`, async () => {
        const result = await get(endpoint);

        expect(result.status).toBe(HttpStatus.OK);
        expect(result.text).toEqual(version);
    });
});
