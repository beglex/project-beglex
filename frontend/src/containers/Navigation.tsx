'use client';

import {Box, CircularProgress, Typography} from '@mui/material';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {useEffect, useState} from 'react';

import {Loader} from '@root/components';
import {UsersTable} from '@root/containers';
import {VersionService} from '@root/services';

const service = new VersionService();

type Mode = 'loading' | 'loaded';

interface Props {
    redirects: {
        register: string;
    };
}

export function Navigation({redirects}: Props) {
    const [version, setVersion] = useState('');
    const [mode, setMode] = useState<Mode>('loading');

    useEffect(() => {
        service.get()
            .then((version) => {
                setVersion(version);
                setMode('loaded');
            })
            .catch(() => {
                redirect(redirects.register);
            });
    }, [redirects.register]);

    if (mode === 'loading') {
        return <Loader />;
    }

    return (
        <>
            <Typography variant="h3" align="center">{Navigation.name}</Typography>
            <Typography variant="h4" align="center">{version}</Typography>
            <Link href="/admin"><Typography variant="h5">Admin</Typography></Link>
            <UsersTable />
        </>
    );
}
