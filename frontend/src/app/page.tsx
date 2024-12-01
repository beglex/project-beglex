import {Box, Container, Paper, Typography} from '@mui/material';

import {Copyright, ThemeToggle} from '@root/components';
import {UsersTable} from '@root/containers';

export default function Home() {
    return (
        <Box position="relative">
            <Typography variant="h3" align="center">Home</Typography>
            <UsersTable />
            <Copyright />
        </Box>
    );
}
