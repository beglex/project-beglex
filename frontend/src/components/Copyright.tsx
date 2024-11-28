import {Box, Typography} from '@mui/material';

export function Copyright() {
    return (
        <Box position="absolute" width="100%" mt={2}>
            <Typography variant="body2" color="textSecondary" align="center" mt={5}>
                {`Copyright © Beglex, ${new Date().getFullYear()}.`}
            </Typography>
        </Box>
    );
}
