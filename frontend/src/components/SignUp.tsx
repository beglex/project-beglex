'use client';

import {LockOutlined as LockOutlinedIcon} from '@mui/icons-material';
import {Avatar, Box, Button, CircularProgress, Paper, TextField, Typography, useTheme} from '@mui/material';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {useState} from 'react';

import type {User} from '@backend/entities';

import {UserService} from '@root/services';

type Mode = 'initial' | 'loading' | 'error' | 'done';

const service = new UserService();

interface Props {
    redirects: {
        home: string;
        register: string;
    };
}

export const SignUp = ({redirects}: Props) => {
    const [user, setUser] = useState<Pick<User, 'login' | 'email' | 'password'>>({login: '', email: '', password: ''});
    const [mode, setMode] = useState<Mode>('initial');
    const [error, setError] = useState('');

    const theme = useTheme();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setUser({...user, [ev.target.name]: ev.target.value});
    };

    const handleSubmit = async (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev?.preventDefault();
        setMode('loading');
        setError('');

        try {
            await service.signUp(user);
            setMode('done');
        } catch (err) {
            if (err instanceof Error) {
                setMode('error');
                setError(err.message);
            } else {
                setMode('initial');
            }
        } finally {
            setUser({login: '', email: '', password: ''});
        }
    };

    const handleKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter') {
            handleSubmit();
        }
    };

    if (mode === 'done') {
        redirect(redirects.home);
    }

    return (
        <Box>
            <Paper elevation={8} sx={{padding: 5, width: 400}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar sx={{backgroundColor: theme.palette.success.main}}><LockOutlinedIcon /></Avatar>
                    <Typography variant="h5">Sign Up</Typography>
                </Box>
                <TextField
                    margin="dense"
                    label="Username"
                    name="login"
                    variant="outlined"
                    value={user.login}
                    fullWidth
                    required
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    name="email"
                    variant="outlined"
                    value={user.email}
                    fullWidth
                    required
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    name="password"
                    type="password"
                    value={user.password}
                    variant="outlined"
                    fullWidth
                    required
                    onChange={handleChange}
                />
                {error
                    ? <Typography m={1} color="warning" textAlign="center">{error}</Typography>
                    : <Typography m={1} color="primary" textAlign="center">{'\u00A0'}</Typography>}
                {mode === 'loading'
                    ? <Typography textAlign="center"><CircularProgress /></Typography>
                    : (
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!user.login || !user.password}
                            sx={{margin: '8px 0', padding: '10px'}}
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Sign up
                        </Button>
                    )}
                <Typography mt={2} align="right">Back to &nbsp;&nbsp;
                    <Link href={redirects.register} style={{position: 'relative', zIndex: 10}}>
                        Sign In
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};
