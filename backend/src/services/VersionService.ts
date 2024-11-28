import {Injectable} from '@nestjs/common';

@Injectable()
export class VersionService {
    get() {
        return process.env.npm_package_version;
    }
}
