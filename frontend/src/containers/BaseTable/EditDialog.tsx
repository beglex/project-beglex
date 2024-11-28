'use client';

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import {useEffect, useState} from 'react';

import type {Base} from '@backend/entities';
import type {BaseService} from '@root/services/BaseService';

import type {Column} from './types';

interface Props<T extends Base> {
    open: boolean;
    target: Partial<T>;
    service: BaseService<T>;
    fields: Column<T>[];
    onClose: () => void;
    onSave: () => void;
}

export function EditDialog<T extends Base>({open, target, onClose, onSave, fields, service}: Props<T>) {
    const [entity, setEntity] = useState<Partial<T>>(target || {});
    const [error, setError] = useState('');

    useEffect(() => setEntity(target || {}), [target]);

    const handleChange = (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setEntity(prev => ({...prev, [key]: e.target.value}));

    const handleSave = async () => {
        try {
            if (entity.id) {
                await service.update(entity.id, entity);
            } else {
                await service.create(entity as Omit<T, 'id'>);
            }
            onSave();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{entity.id ? 'Edit' : 'Create'}</DialogTitle>
            <DialogContent>
                {fields.map(field => (
                    <TextField
                        key={String(field.key)}
                        label={field.label}
                        value={entity[field.key] || ''}
                        onChange={handleChange(field.key)}
                        required={!!field.required}
                        type={field.hidden ? 'password' : 'text'}
                        fullWidth
                        margin="dense"
                    />
                ))}
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
