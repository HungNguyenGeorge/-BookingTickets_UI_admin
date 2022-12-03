import { useContext, useEffect, useState } from 'react';
// @mui
import { Link, Stack, TextField, Container, Typography, styled, RadioGroup, FormControl, FormControlLabel, FormLabel, Radio, Box, Skeleton, Checkbox, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import * as Tickets from "../../../hooks/ticket";
import * as Orders from "../../../hooks/order";
import { LoadingButton } from '@mui/lab';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { orderBy } from 'lodash';
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import TicketListHead from './TicketListHead';
import { format, formatISO } from 'date-fns';

const MySwal = withReactContent(Swal)

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

const TABLE_HEAD = [
    { id: "event", label: "Event", alignRight: false },
    { id: "name", label: "Name", alignRight: false },
    { id: "description", label: "Description", alignRight: false },
    { id: "price", label: "Price", alignRight: false },
    { id: "total_quantity", label: "Total", alignRight: false },
    { id: "available_quantity", label: "Available", alignRight: false },
];

export default function TicketsTable({ event }) {
    if (!event) return;

    const { _id } = event;

    const [ticketDataSource, setTicketDataSource] = useState<Array<any>>([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await Tickets.getTicketsByEvent({ eventId: _id })
                setTicketDataSource(res.data)
            } catch (err) {
                console.log("🚀 ~ file: LoginForm.tsx:37 ~ handleClick ~ err", err)
            }
        }
        getData();
    }, [_id])

    return (
        <>
            <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                    <TicketListHead
                        headLabel={TABLE_HEAD}
                    />
                    <TableBody>
                        {ticketDataSource.map((row, index) => {
                            const {
                                _id,
                                name,
                                description,
                                price,
                                total_quantity,
                                available_quantity,
                            } = row;
                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    tabIndex={-1}
                                    role="checkbox"
                                >

                                    <TableCell component="th" scope="row">
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Typography variant="subtitle2" noWrap>
                                                {event.name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>


                                    <TableCell align="left">{fDate(name, "dd-MM-yyyy")}</TableCell>
                                    <TableCell align="left">
                                        {

                                            formatISO(new Date(description), {
                                                representation: "time",
                                            }).slice(0, 5)

                                        }
                                    </TableCell>
                                    <TableCell align="left">{price} </TableCell>
                                    <TableCell align="left">{total_quantity} </TableCell>
                                    <TableCell align="left">{available_quantity} </TableCell>



                                </TableRow>
                            );
                        })}
                        {ticketDataSource.length <= 0 && (
                            <TableRow style={{ height: 53 * ticketDataSource.length }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>

                    {ticketDataSource.length <= 0 && (
                        <TableBody>
                            <TableRow>
                                <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                    <Paper
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="h6" paragraph>
                                            Not found
                                        </Typography>

                                        <Typography variant="body2">
                                            No results found for &nbsp;
                                            {/* <strong>&quot;{filterName}&quot;</strong>. */}
                                            <br /> Try checking for typos or using complete words.
                                        </Typography>
                                    </Paper>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

        </>
    );
}
