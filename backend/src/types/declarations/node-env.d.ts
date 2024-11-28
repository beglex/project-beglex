import {Environment} from '../common';

declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                HOST?: string;
                NODE_ENV?: Environment;
                PORT?: string;

                npm_package_version?: string;
            }
        }
    }
}
