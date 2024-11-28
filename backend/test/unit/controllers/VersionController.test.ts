import type {TestingModule} from '@nestjs/testing';

import {Test} from '@nestjs/testing';

import {VersionController} from '@root/controllers';
import {VersionService} from '@root/services';

import {version} from '../../../package.json';

describe(`UNIT: ${VersionController.name}`, () => {
    let controller: VersionController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [VersionController],
            providers: [VersionService],
        }).compile();

        controller = app.get(VersionController);
    });

    it(`Should return version '${version}'`, () => {
        expect(controller.get()).toBe(version);
    });
});
