'use client';

import type {SelectChangeEvent} from '@mui/material';

import {ArrowDropDown as ArrowDown, ArrowDropUp as ArrowUp, Check as CheckIcon} from '@mui/icons-material';
import {
    Alert, Box, Button, MenuItem, Pagination, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
} from '@mui/material';
import {useCallback, useEffect, useState} from 'react';

import type {Base} from '@backend/entities/Base';
import type {GetManyQuery} from '@backend/types';
import type {BaseService} from '@root/services/BaseService';

import {Loader} from '@root/components';

import type {Column} from './types';

import {DeleteDialog} from './DeleteDialog';
import {EditDialog} from './EditDialog';

const defaults: GetManyQuery<Base> = {limit: 5, order: 'ASC', page: 1, search: {}, sort: 'id'};

interface Props<T extends Base> {
    service: BaseService<T>;
    columns: Column<T>[];
    renderRow: (entity: T, onEdit: (entity: Partial<T>) => void, onDelete: (entity: T) => void) => React.ReactNode;
}

export function BaseTable<T extends Base>({service, renderRow, columns}: Props<T>) {
    const [mode, setMode] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [entities, setEntities] = useState<T[]>([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [order, setOrder] = useState<'ASC' | 'DESC'>(defaults.order);
    const [page, setPage] = useState(defaults.page);
    const [limit, setLimit] = useState(defaults.limit);
    const [totalPages, setTotalPages] = useState(0);

    const [editing, setEditing] = useState<Partial<T> | null>(null);
    const [deleting, setDeleting] = useState<T | null>(null);

    const [error, setError] = useState<string | null>(null);

    const fetchEntities = useCallback(async (req: {search?: string; page?: number; limit?: number}) => {
        setMode('loading');
        setError(null);
        try {
            const searchQuery = req.search
                ? columns.filter(c => c.searchable)
                    .map(col => ({[col.key]: {ilike: req.search}})) as Array<Record<keyof T, any>>
                : undefined;
            const {data, pageCount} = await service.get({
                search: searchQuery,
                page: req.page || defaults.page,
                limit: req.limit || limit,
                sort: sortField || undefined,
                order,
            });
            setEntities(data);
            setTotalPages(pageCount);
            setMode('loaded');
        } catch (err) {
            setError((err as Error).message);
            setMode('error');
        }
    }, [service, sortField, order, limit, columns]);

    useEffect(() => {
        fetchEntities({});
    }, [fetchEntities]);

    const handleSort = (field: keyof T) => {
        const direction = sortField === field && order === 'ASC' ? 'DESC' : 'ASC';
        setSortField(field);
        setOrder(direction);
        fetchEntities({search, page});
    };

    const handlePage = (_: any, newPage: number) => {
        if (newPage !== page) {
            setPage(newPage);
            fetchEntities({search, page: newPage});
        }
    };

    const handleLimit = (ev: SelectChangeEvent<number>) => {
        const newLimit = Number(ev.target.value);
        setLimit(newLimit);
        setPage(1);
        fetchEntities({search, page: 1, limit: newLimit});
    };

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === 'Enter') {
            fetchEntities({search, page});
        }
    };

    if (mode === 'loading') {
        return <Loader />;
    }

    if (mode === 'error') {
        <Box>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                <Box>Error: {error}</Box>
                <Button variant="outlined" onClick={() => fetchEntities({search, page})}>
                    Retry
                </Button>
            </Alert>
        </Box>;
    }

    return (
        <Box mx={4}>
            <Box my="1rem" display="grid" gridTemplateColumns="4fr 1fr 1fr" gap={1}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder={`Search by ${columns.filter(c => c.searchable).map(c => c.label).join(', ')}`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button variant="contained" onClick={() => fetchEntities({search})}>
                    Search
                </Button>
                <Button variant="contained" color="success" onClick={() => setEditing({})}>
                    Create
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.filter(c => !c.hidden).map(c => (
                                <TableCell
                                    key={String(c.key)}
                                    sx={{'&:hover': {opacity: 0.5, cursor: 'pointer'}}}
                                    onClick={() => handleSort(c.key)}
                                >
                                    {c.label}
                                    {sortField === c.key && (order === 'ASC' ? <ArrowUp /> : <ArrowDown />)}
                                </TableCell>
                            ))}
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entities.map(entity => renderRow(entity, setEditing, setDeleting))}
                    </TableBody>
                </Table>
                <Box mt="1rem" display="grid" gridTemplateColumns="4fr 1fr">
                    <Pagination count={totalPages} page={page} onChange={handlePage} />
                    <Select value={limit} onChange={handleLimit} variant="standard" sx={{minWidth: '5rem'}}>
                        {[5, 10, 25, 50, 100].map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </TableContainer>

            {/* Edit Dialog */}
            {editing && (
                <EditDialog
                    open={!!editing}
                    target={editing}
                    service={service}
                    fields={columns.filter(c => c.editable)}
                    onClose={() => setEditing(null)}
                    onSave={() => {
                        setEditing(null);
                        fetchEntities({search, page});
                    }}
                />
            )}

            {/* Delete Dialog */}
            {deleting && (
                <DeleteDialog
                    open={!!deleting}
                    target={deleting}
                    service={service}
                    onClose={() => setDeleting(null)}
                    onSave={() => {
                        setDeleting(null);
                        fetchEntities({search, page});
                    }}
                />
            )}
        </Box>
    );
}
