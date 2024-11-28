import {SignIn} from '@root/components';

export default function SignInPage() {
    return (
        <SignIn redirects={{home: '/', register: '/authentication/signup'}} />
    );
}
