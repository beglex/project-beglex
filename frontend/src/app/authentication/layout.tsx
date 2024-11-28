import type {PropsWithChildren} from 'react';

import {Box, Typography} from '@mui/material';

import {Copyright} from '../../components';

export default function AuthenticationLayout({children}: PropsWithChildren) {
    return (
        <Box position="relative">
            <Typography variant="h3" align="center" margin={5}>Authorization</Typography>
            <Box display="flex" justifyContent="center" minHeight={200} maxHeight={400}>
                {children}
            </Box>
        </Box>
    );
}
