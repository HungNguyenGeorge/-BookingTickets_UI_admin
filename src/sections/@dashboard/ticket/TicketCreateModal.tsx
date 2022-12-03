import { useContext, useEffect, useState } from 'react';
// @mui
import { Link, Stack, TextField, Container, Typography, styled, RadioGroup, FormControl, FormControlLabel, FormLabel, Radio, Box, Skeleton, Checkbox, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableRow, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

import * as Tickets from "../../../hooks/ticket";
import * as Orders from "../../../hooks/order";
import { LoadingButton } from '@mui/lab';

import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useFormik } from 'formik';
import * as yup from "yup";

import * as TicketService from "../../../hooks/ticket"


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

const validationSchema = yup.object({
    // email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
    // password: yup
    //   .string('Enter your password')
    //   .min(8, 'Password should be of minimum 8 characters length')
    //   .required('Password is required'),
    name: yup.string().required("Name is required"),
    event: yup.string(),
    description: yup.string(),
    price: yup.number(),
    total_quantity: yup.number().required("Required"),
    available_quantity: yup.number().required("Required"),
});


export default function TicketsTable({ event, onSuccess }) {
    if (!event) return;

    const { _id } = event;

    const [ticketDataSource, setTicketDataSource] = useState<Array<any>>([]);

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



    const formik = useFormik({
        initialValues: {
            name: new Date().toISOString(),
            description: new Date().toISOString(),
            price: 0,
            total_quantity: 0,
            available_quantity: 0
        },
        validationSchema,
        onSubmit: async (value: any) => {
            console.log("🚀 ~ file: EventPage.tsx:293 ~ onSubmit: ~ value", value)
            if (!value) return;
            const payload = {
                event: _id,
                name: value.name,
                description: value.description,
                price: value.price,
                total_quantity: value.total_quantity,
                available_quantity: value.available_quantity
            };
            try {
                await TicketService.createTicket(payload);
                onSuccess();
            } catch (error) {
                console.log("🚀 ~ file: TickestTable.tsx:93 ~ onSubmit: ~ error", error)
            }
        },

    });

    return (
        <>
            <DialogTitle>
                Add Ticket
            </DialogTitle>
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        m: "auto",
                        width: "100%",
                        "& .MuiFormControl-root": { m: 1, width: "400px" },
                    }}
                    onSubmit={formik.handleSubmit}
                >


                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Name"
                                inputFormat="dd-MM-yyyy"
                                value={formik.values.name || new Date().toISOString()}
                                onChange={(value) => formik.setFieldValue("name", value, true)}
                                renderInput={(params) => <TextField {...params}
                                    name="name" type="text" id="name" fullWidth
                                    helperText={formik.touched.name && formik.errors.name + ""} />}
                            />
                        </Stack>
                    </LocalizationProvider>


                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Description"
                            value={formik.values.description}
                            onChange={(value) => formik.setFieldValue("description", value, true)}
                            renderInput={(params) => <TextField {...params}
                                name="description" type="text" id="description" fullWidth
                                helperText={formik.touched.description && formik.errors.description + ""} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        fullWidth
                        id="price"
                        name="price"
                        label="Price"
                        type="number"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price + ""}
                    />
                    <TextField
                        fullWidth
                        id="total_quantity"
                        name="total_quantity"
                        label="Total Quantity"
                        type="number"
                        value={formik.values.total_quantity}
                        onChange={formik.handleChange}
                        error={formik.touched.total_quantity && Boolean(formik.errors.total_quantity)}
                    />
                    <TextField
                        fullWidth
                        id="available_quantity"
                        name="available_quantity"
                        label="Available Quantity"
                        type="number"
                        value={formik.values.available_quantity}
                        onChange={formik.handleChange}
                        error={formik.touched.available_quantity && Boolean(formik.errors.available_quantity)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <LoadingButton size="large" type="submit" variant="contained" onClick={_ => formik.handleSubmit()}>
                    Submit
                </LoadingButton>
                <Button onClick={_ => onSuccess()}>Close</Button>
            </DialogActions>
        </>
    );
}
