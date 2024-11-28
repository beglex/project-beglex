'use client';

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {useState} from 'react';

import type {Base} from '@backend/entities';
import type {BaseService} from '@root/services/BaseService';

interface Props<T extends Base> {
    open: boolean;
    target: T | null;
    service: BaseService<T>;
    onClose: () => void;
    onSave: () => void;
}

export function DeleteDialog<T extends Base>({open, target, onClose, onSave, service}: Props<T>) {
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (target) {
            try {
                await service.delete(target.id);
                onSave();
            } catch (err) {
                setError((err as Error).message);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete {target?.id}?</Typography>
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleDelete} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
