'use client';

import {Brightness4, Brightness7} from '@mui/icons-material';
import {IconButton} from '@mui/material';

import {useThemeContext} from '@root/contexts'; // Import the context hook

export function ThemeToggle() {
    const {mode, toggleTheme} = useThemeContext();

    return (
        <IconButton
            color="inherit"
            sx={{position: 'fixed', top: 16, right: 16}}
            onClick={() => {
                toggleTheme();
                localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
    );
}
