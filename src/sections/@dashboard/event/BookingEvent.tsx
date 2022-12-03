import { useContext, useEffect, useState } from 'react';
// @mui
import { Link, Stack, TextField, Container, Typography, styled, RadioGroup, FormControl, FormControlLabel, FormLabel, Radio, Box, Skeleton } from '@mui/material';

import * as Tickets from "../../../hooks/ticket";
import * as Orders from "../../../hooks/order";
import { LoadingButton } from '@mui/lab';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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


export default function BookingForm({ event, onClose }) {

    const { _id } = event;

    const [quantity, setQuantity] = useState<number>(0);
    const [tickets, setTickets] = useState<Array<any>>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [ticketQuantity, setTicketQuantity] = useState<number>(0);
    const [loadingTickes, setLoadingTickes] = useState(true);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [createOrderSts, setCreateOrderSts] = useState<number>(0); // 0: not create, 1: creating, 2: success

    useEffect(() => {
        console.log("Event to booking: ", event);
        setLoadingTickes(true);
        const getData = async () => {
            try {
                const res = await Tickets.getTicketsByEvent({ eventId: _id })
                setTickets(res.data)
                setLoadingTickes(false);
                setTicketQuantity(0);
            } catch (err) {
                setLoadingTickes(false);
                console.log("🚀 ~ file: LoginForm.tsx:37 ~ handleClick ~ err", err)
            }

        }
        getData();
    }, [_id, createOrderSts])

    useEffect(() => {
        if (selectedTicket) {
            const { price } = selectedTicket;
            setTicketQuantity(selectedTicket?.available_quantity || 0)
            setQuantity(0)
            setTicketPrice(price)
        }

    }, [selectedTicket])

    const handleChangeTicket = e => {
        const selected = tickets.find(t => e.target.defaultValue === t._id)
        if (selected) {
            setSelectedTicket(selected);
        }
    }

    const onCreateOrder = async _ => {
        setCreateOrderSts(1)
        const orderData = {
            event: _id,
            ticket: selectedTicket._id,
            totalPrice: quantity * ticketPrice,
            quantity,
            status: 0
        }
        try {
            const res = await Orders.createOrder(orderData)
            setCreateOrderSts(0)
            MySwal.fire({
                title: <p>Create successful!</p>,
                icon: "success"
            })
            onClose();
        } catch (err) {
            MySwal.fire({
                title: <p>Error!</p>,
                text: err.message,
                icon: "error"
            })
            setCreateOrderSts(0)
            console.log("🚀 ~ file: LoginForm.tsx:37 ~ handleClick ~ err", err)
        }
    }

    return (
        <>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Booking for {event.name}
                    </Typography>

                    {
                        (!loadingTickes || tickets.length > 0) ?
                            <Stack>
                                <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Select Ticket</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            onChange={handleChangeTicket}
                                        >
                                            {
                                                tickets.map((t, index) => {
                                                    const ticketLabel = `${t.name} at ${t.description} `
                                                    return <FormControlLabel id={t._id} key={index} value={t._id} control={<Radio />} label={ticketLabel} />
                                                })
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
                                    <TextField
                                        id="outlined-number"
                                        label="Quality"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled={ticketQuantity === 0}
                                        value={quantity}
                                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                                        onChange={(e) => {
                                            var value = parseInt(e.target.value, 10);

                                            if (value > ticketQuantity) value = ticketQuantity;
                                            if (value < 1) value = 1;

                                            setQuantity(value);
                                        }}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ marginTop: 3, display: "flex", justifyContent: "flex-end" }}>
                                    <Typography variant="h5" sx={{ alignSelf: "center" }}>
                                        {`${quantity * ticketPrice}$`}
                                    </Typography>

                                    <LoadingButton variant="contained" disabled={quantity < 1} onClick={onCreateOrder} loading={createOrderSts === 1}>
                                        Ok
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                            :

                            <Box sx={{ width: 300 }}>
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Stack direction="row" spacing={2} sx={{ marginTop: 3, display: "flex", justifyContent: "flex-end" }}>
                                    <Skeleton animation="wave" height={100} width={200} />
                                </Stack>
                            </Box>

                    }




                </StyledContent>
            </Container>
        </>
    );
}
