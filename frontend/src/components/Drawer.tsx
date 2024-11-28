'use client';

import {Adjust as AdjustIcon} from '@mui/icons-material';
import {Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer} from '@mui/material';
import {Fragment, useState} from 'react';

const directions = ['top', 'left', 'right', 'bottom'] as const;
const empty: string[] = [];

interface Props {
    upper: string[];
    lower?: string[];
}

export function Drawer({upper = empty, lower = empty}: Props) {
    const [state, setState] = useState<Record<typeof directions[number], boolean>>(
        {top: false, left: false, bottom: false, right: false});

    const toggleDrawer = (anchor: typeof directions[number], open: boolean) => () => {
        setState({...state, [anchor]: open});
    };

    return (
        <>
            {directions.map(anchor => (
                <Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        <div
                            style={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
                            onClick={toggleDrawer(anchor, false)}
                            onKeyDown={toggleDrawer(anchor, false)}
                        >
                            <List>
                                {upper.map(text => (
                                    <ListItemButton key={text}>
                                        <ListItemIcon>
                                            <AdjustIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                ))}
                            </List>
                            <Divider />
                            <List>
                                {lower.map(text => (
                                    <ListItemButton key={text}>
                                        <ListItemIcon>
                                            <AdjustIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </div>
                    </SwipeableDrawer>
                </Fragment>
            ))}
        </>
    );
}
