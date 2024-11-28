import {Box, Container, Paper, Typography} from '@mui/material';

import {Copyright, ThemeToggle} from '../components';
import {UsersTable} from '../containers';

export default function Home() {
    return (
        <Box position="relative">
            <Typography variant="h3" align="center">Home</Typography>
            <UsersTable />
            <Copyright />
        </Box>
    );
}
