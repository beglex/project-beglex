'use client';

import {Button, TableCell, TableRow} from '@mui/material';
import {format} from 'date-fns';

import {UserService} from '@root/services';

import {BaseTable} from './BaseTable';

export function UsersTable() {
    return (
        <BaseTable
            service={new UserService()}
            columns={[
                {key: 'login', label: 'Login', editable: true, searchable: true, required: true},
                {key: 'email', label: 'Email', editable: true, searchable: true, required: true},
                {key: 'name', label: 'Name', editable: true, searchable: true},
                {key: 'password', label: 'Password', editable: true, hidden: true, required: true},
                {key: 'updatedAt', label: 'Updated'},
                {key: 'createdAt', label: 'Created'},
            ]}
            renderRow={(user, onEdit, onDelete) => (
                <TableRow key={user.id}>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{format(new Date(user.updatedAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>
                        <Button onClick={() => onEdit(user)}>Edit</Button>
                        <Button color="error" onClick={() => onDelete(user)}>Delete</Button>
                    </TableCell>
                </TableRow>
            )}
        />
    );
}
