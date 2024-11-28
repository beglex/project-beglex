import {Controller, Get} from '@nestjs/common';

import {VersionService} from '@root/services';

@Controller('/api/version')
export class VersionController {
    constructor(
        private readonly service: VersionService,
    ) {
    }

    @Get()
    get() {
        return this.service.get();
    }
}
