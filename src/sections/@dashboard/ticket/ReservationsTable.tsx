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
import { sentenceCase } from 'change-case';
import Label from '../../../components/label';

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
    { id: "name", label: "Customer", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "ticket", label: "Ticket", alignRight: false },
    { id: "price", label: "Total Price", alignRight: false },
    { id: "quantity", label: "Quantity", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
];

export default function ReservationsTable({ event }) {
    if (!event) return;

    const { _id } = event;

    const [reservationDataSource, setReservationDataSource] = useState<Array<any>>([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await Orders.getReservationsByEvent({ eventId: _id })
                setReservationDataSource(res.data)
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
                        {reservationDataSource.map((row, index) => {
                            const {
                                _id,
                                owner,
                                ticket,
                                total_price,
                                quantity,
                                status
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
                                                {owner?.fullname}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{owner?.email} </TableCell>


                                    <TableCell align="left">
                                        {
                                            `${fDate(ticket?.name, "dd-MM-yyyy")} at ${formatISO(new Date(ticket.description), {
                                                representation: "time"
                                            }).slice(0, 5)
                                            } `
                                        }
                                    </TableCell>
                                    <TableCell align="left">{total_price} </TableCell>
                                    <TableCell align="left">{quantity} </TableCell>
                                    <TableCell align="left">
                                        <Label color={status === 1 ? "error" : "success"}>
                                            {
                                                (() => {
                                                    switch (status) {
                                                        case 0:
                                                            return sentenceCase("Confirmed");
                                                        case 1:
                                                            return sentenceCase("Cancelled");
                                                        default:
                                                            return sentenceCase("Cancelled");
                                                    }
                                                })()
                                            }
                                        </Label>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                        {reservationDataSource.length <= 0 && (
                            <TableRow style={{ height: 53 * reservationDataSource.length }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>

                    {reservationDataSource.length <= 0 && (
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
