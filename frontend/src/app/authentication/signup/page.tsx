import {SignUp} from '@root/components';

export default function SignUpPage() {
    return (
        <SignUp redirects={{home: '/', register: '/authentication/signin'}} />
    );
}
