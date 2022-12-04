import { Helmet } from "react-helmet-async";
import { filter, sample } from "lodash";
import { faker } from "@faker-js/faker";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormik } from "formik";
import * as yup from "yup";
// import axios from 'axios';
// @mui
import {
  Card,
  Box,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  Switch,
} from "@mui/material";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
import * as EventService from "../hooks/event";
import { fDate } from "../utils/formatTime";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";

import { TicketsTable, TicketCreateModal, ReservationsTable } from "../sections/@dashboard/ticket";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "slug", label: "Slug", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "poster", label: "Poster", alignRight: false },
  { id: "start_date", label: "Start", alignRight: false },
  { id: "end_date", label: "End", alignRight: false },
  { id: "published", label: "Published", alignRight: false },
  { id: "" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  TransitionEvent: "all 1s",
};
// ----------------------------------------------------------------------

// Formik config
const validationSchema = yup.object({
  // email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  // password: yup
  //   .string('Enter your password')
  //   .min(8, 'Password should be of minimum 8 characters length')
  //   .required('Password is required'),
  name: yup.string().required("Name is required"),
  slug: yup.string(),
  description: yup.string(),
  poster: yup.string(),
  start_date: yup.string().required("Start date is required"),
  end_date: yup.string().required("End date is required"),
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState(null);

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const [universityDataSource, setUniversityDataSource] = useState([]);
  const [eventDataSource, setEventDataSource] = useState([]);

  const [isCreate, setIsCreate] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);

  const [isDelete, setIsDelete] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [openModalTickets, setOpenModalTickets] = useState(false);

  const [openModalReservations, setOpenModalReservations] = useState(false);

  const [openModalAddTicket, setOpenModalAddTicket] = useState(false);

  const handleOpenModal = () => setOpenModal(true);



  const handleCloseModal = () => {
    setOpenModal(false);
    formik.handleReset(null);
    setCurrRowFocus(null);
  };


  const handleCloseModalTickets = () => {
    setOpenModalTickets(false);
    setCurrRowFocus(null);
  };

  const handleCloseModalReservations = () => {
    setOpenModalReservations(false);
    setCurrRowFocus(null);
  };


  const handleCloseModalAddTicket = () => {
    setOpenModalAddTicket(false);
    setCurrRowFocus(null);
  };

  const [currRowFocus, setCurrRowFocus] = useState(null);

  const handleOpenMenu = (event, row) => {
    console.log(
      "🚀 ~ file: UserPage.js ~ line 145 ~ handleOpenMenu ~ row",
      row
    );
    setOpen(event.currentTarget);
    setCurrRowFocus({ ...row });
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCurrRowFocus(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = eventDataSource.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleEditRow = () => {
    setOpenModal(true);
    formik.setValues(currRowFocus);
    setOpen(null);
  };

  const handleShowTickets = () => {
    setOpenModalTickets(true);
    setOpen(null);
  };

  const handleShowReservations = () => {
    setOpenModalReservations(true);
    setOpen(null);
  };

  const handleShowAddTicket = () => {
    setOpenModalAddTicket(true);
    setOpen(null);
  };
  const handleDeleteRow = async () => {
    try {
      await EventService.deleteEvent(currRowFocus._id);
      setIsDelete(true);
      setOpen(null);
      setCurrRowFocus(null);
    } catch (error) {
      console.log("🚀 ~ file: EventPage.tsx:222 ~ handleDeleteRow ~ error", error)

    }
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handlePublished = async (event) => {
    try {
      await EventService.updateEvent(event._id, { ...event, published: !event.published });
      setIsUpdate(true);
    } catch (error) {
      console.log("🚀 ~ file: EventPage.tsx:222 ~ handleDeleteRow ~ error", error)
    }
  };

  const handleDeleteUser = (ids) => {
    console.log(
      "🚀 ~ file: UserPage.js ~ line 193 ~ handleDeleteUser ~ ids",
      selected
    );
    setEventDataSource(
      eventDataSource.filter((item) => !selected.includes(item._id))
    );
    setSelected([]);
    console.log(eventDataSource);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - eventDataSource.length)
      : 0;

  const filteredUsers = applySortFilter(
    eventDataSource,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      poster: "",
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    },
    validationSchema,
    onSubmit: async (value: any) => {
      console.log("🚀 ~ file: EventPage.tsx:293 ~ onSubmit: ~ value", value)
      if (!value) return;
      value.isVerified = value.verified;
      value.id = faker.datatype.uuid();
      value.avatarUrl = `/assets/images/avatars/avatar_${eventDataSource.length + 1
        }.jpg`;
      if (!currRowFocus) {
        const payload = {
          name: value.name,
          slug: value.slug,
          description: value.description,
          poster: value.poster,
          startDate: new Date(value.start_date).toISOString(),
          endDate: new Date(value.end_date).toISOString(),
          published: value.published || false,
        };
        await EventService.createEvent(payload).then((data) => {
          setIsCreate(true);
          handleCloseModal();
        });
      } else {
        // setEventDataSource([value, ...eventDataSource]);
        // handleAddUser(value);
        const payload = {
          name: value.name,
          slug: value.slug,
          description: value.description,
          poster: value.poster,
          startDate: new Date(value.start_date).toISOString(),
          endDate: new Date(value.end_date).toISOString(),
          published: value.published || false,
        };
        await EventService.updateEvent(currRowFocus._id, payload).then(
          (data) => {
            setIsUpdate(true);
            handleCloseModal();
          }
        );
      }
      handleCloseModal();
    },

  });

  useEffect(() => {
    if (isCreate || isUpdate || isDelete || isFirstLoad) {
      const getUserList = async () => {
        const result = await EventService.getAllEvents();
        setEventDataSource(result?.data);
        setIsFirstLoad(false)
        setIsCreate(false);
        setIsUpdate(false);
        setIsDelete(false);
      };
      getUserList();
    }

  }, [isCreate, isUpdate, isDelete]);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            EVENTS
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Event
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteIds={handleDeleteUser}
          />

          {/* <Scrollbar> */}
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={eventDataSource.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {eventDataSource.map((row, index) => {
                  const {
                    _id,
                    name,
                    slug,
                    description,
                    poster,
                    start_date,
                    end_date,
                    published,
                  } = row;
                  const selectedUser = selected.indexOf(_id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}
                      role="checkbox"
                      selected={selectedUser}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUser}
                          onChange={(event) => handleClick(event, _id)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left"> {slug} </TableCell>

                      <TableCell align="left">{description}</TableCell>
                      <TableCell align="left">{poster} </TableCell>
                      <TableCell align="left">{fDate(start_date, 'dd-MM-yyyy')} </TableCell>
                      <TableCell align="left">{fDate(end_date, 'dd-MM-yyyy')} </TableCell>


                      <TableCell align="left">
                        <Switch
                          checked={published}
                          onChange={_ => handlePublished(row)}
                          disabled={new Date().toISOString() > new Date(end_date).toISOString()}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(e) => handleOpenMenu(e, row)}
                        >
                          <Iconify icon={"eva:more-vertical-fill"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={eventDataSource.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 200,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditRow}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleShowTickets}>
          <Iconify icon={"ion:ticket-outline"} sx={{ mr: 2 }} />
          Tickets
        </MenuItem>
        <MenuItem onClick={handleShowAddTicket}>
          <Iconify icon={"material-symbols:bookmark-add-rounded"} sx={{ mr: 2 }} />
          Add Ticket
        </MenuItem>
        <MenuItem onClick={handleShowReservations}>
          <Iconify icon={"ic:baseline-local-grocery-store"} sx={{ mr: 2 }} />
          Reservations
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }} onClick={handleDeleteRow}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog fullWidth={false} open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currRowFocus ? "Edit User" : "Create new User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Student Information</DialogContentText>
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
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name + ""}
            />
            <TextField
              fullWidth
              id="slug"
              name="slug"
              label="Slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.dexcription && Boolean(formik.errors.dexcription)}
            />
            <TextField
              fullWidth
              id="poster"
              name="poster"
              label="Poster"
              type="text"
              value={formik.values.poster}
              onChange={formik.handleChange}
              error={formik.touched.poster && Boolean(formik.errors.poster)}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="dd-MM-yyyy"
                  value={formik.values.start_date || new Date().toISOString()}
                  onChange={(value) => formik.setFieldValue("start_date", value, true)}
                  renderInput={(params) => <TextField {...params}
                    name="start_date" type="text" id="start_date" fullWidth
                    helperText={formik.touched.start_date && formik.errors.start_date + ""} />}
                />
              </Stack>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="dd-MM-yyyy"
                  value={formik.values.end_date || new Date().toISOString()}
                  onChange={(value) => formik.setFieldValue("end_date", value, true)}

                  renderInput={(params) => <TextField
                    name="end_date" type="text" id="end_date" {...params} fullWidth
                    helperText={formik.touched.end_date && formik.errors.end_date + ""} />}
                />
              </Stack>
            </LocalizationProvider>
            <TextField
              fullWidth
              id="published"
              name="published"
              label="Published"
              type="text"
              value={formik.values.published}
              onChange={formik.handleChange}
              error={formik.touched.published && Boolean(formik.errors.published)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton size="large" type="submit" variant="contained" onClick={_ => formik.handleSubmit()}>
            Submit
          </LoadingButton>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth={true} maxWidth="xl" open={openModalTickets} onClose={handleCloseModalTickets}>
        <DialogTitle>
          Tickets
        </DialogTitle>
        <DialogContent>
          <TicketsTable event={currRowFocus} />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth={false} maxWidth="lg" open={openModalAddTicket} onClose={handleCloseModalAddTicket}>
        <TicketCreateModal event={currRowFocus} onSuccess={handleCloseModalAddTicket} />
      </Dialog>
      <Dialog fullWidth={true} maxWidth="xl" open={openModalReservations} onClose={handleCloseModalReservations}>
        <DialogTitle>
          Reservations
        </DialogTitle>
        <DialogContent>
          <ReservationsTable event={currRowFocus} />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </>
  );
}
