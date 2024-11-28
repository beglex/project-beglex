import {User} from '@root/entities';
import {ApplicationRequest} from '@root/types';

export function useApplicationData(request: ApplicationRequest) {
    return new ApplicationData(request);
}

class ApplicationData {
    constructor(
        private readonly request: ApplicationRequest,
    ) {
        request.data ??= {};
    }

    private get(key: keyof ApplicationRequest['data']) {
        if (key in this.request.data) {
            return this.request.data[key];
        }

        throw new Error(`'${key}' is not in 'request.data'`);
    }

    get user() {
        return this.get('user')!;
    }

    set user(user: User) {
        this.request.data.user = user;
    }
}
