'use client';

import type {Theme} from '@mui/material';
import type {PropsWithChildren} from 'react';

import {colors, createTheme, ThemeProvider as MUIThemeProvider} from '@mui/material';
import {createContext, useContext, useEffect, useState} from 'react';

type ThemeContextType = {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({children}: PropsWithChildren & {theme: Theme}) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: colors.blue[500],
                light: colors.blue[100],
                dark: colors.blue[900],
            },
            secondary: {
                main: colors.purple[500],
                light: colors.purple[100],
                dark: colors.purple[900],
            },
            success: {
                main: colors.green[500],
                dark: colors.green[900],
                light: colors.green[100],
            },
            warning: {
                main: colors.orange[500],
                dark: colors.orange[900],
                light: colors.orange[100],
            },
            error: {
                main: colors.red[500],
                dark: colors.red[900],
                light: colors.red[100],
            },
            background: {
                default: mode === 'light' ? colors.grey[50] : colors.grey[900],
                paper: mode === 'light' ? colors.common.white : colors.grey[800],
            },
            text: {
                primary: mode === 'light' ? colors.grey[900] : colors.common.white,
                secondary: mode === 'light' ? colors.grey[600] : colors.grey[400],
            },
        },
        typography: {
            fontFamily: 'var(--font-roboto)',
        },
    });

    return (
        <ThemeContext.Provider value={{mode, toggleTheme}}>
            <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
