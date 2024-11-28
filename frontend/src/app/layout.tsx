import type {Metadata} from 'next';
import type {PropsWithChildren} from 'react';

import {Box, Paper} from '@mui/material';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {Roboto} from 'next/font/google';

import {ThemeToggle} from '@root/components';

import './globals.css';

import {ThemeProvider} from '@root/contexts';
import {theme} from '@root/theme';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: 'Beglex',
    description: 'Beglex Frontend',
};

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body className={roboto.variable}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <Box
                            sx={{
                                width: '100vw',
                                minHeight: '100vh',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {children}
                            <ThemeToggle />
                        </Box>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
