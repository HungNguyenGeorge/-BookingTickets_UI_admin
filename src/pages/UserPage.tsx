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
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock

import * as UserService from "../hooks/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "fullname", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
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
  school: yup.string().required("School is required"),
  status: yup.string().required("Status is required"),
  role: yup.string(),
  verified: yup.string(),
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
  const [userDataSource, setUserDataSource] = useState([]);

  const [isCreate, setIsCreate] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);

  const [isDelete, setIsDelete] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    formik.handleReset(null);
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
      const newSelecteds = userDataSource.map((n) => n._id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleEditRow = () => {
    setOpenModal(true);
    currRowFocus.school = currRowFocus.universityId;
    currRowFocus.verified = currRowFocus.verify;
    currRowFocus.status = currRowFocus.status ? "active" : "banned";
    formik.setValues(currRowFocus);
    setOpen(null);
  };
  const handleDeleteRow = async () => {
    setIsDelete(true);
    await UserService.deleteUser(currRowFocus._id);
    setOpen(null);
    setCurrRowFocus(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteUser = (ids) => {
    console.log(
      "🚀 ~ file: UserPage.js ~ line 193 ~ handleDeleteUser ~ ids",
      selected
    );
    setUserDataSource(
      userDataSource.filter((item) => !selected.includes(item._id))
    );
    setSelected([]);
    console.log(userDataSource);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - userDataSource.length)
      : 0;

  const filteredUsers = applySortFilter(
    userDataSource,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const formik = useFormik({
    initialValues: {
      name: "",
      school: "",
      role: "",
      verified: "no",
      status: "active",
    },
    validationSchema,
    onSubmit: async (value: any) => {
      if (!value) return;
      value.isVerified = value.verified;
      value.id = faker.datatype.uuid();
      value.avatarUrl = `/assets/images/avatars/avatar_${userDataSource.length + 1
        }.jpg`;
      if (!currRowFocus) {
        const payload = {
          universityId: parseInt(value.school, 10),
          name: value.name,
          role: value.role,
          status: value.status === "active",
          verify: value.verified,
          age: 22,
        };
        await UserService.createUser(payload).then((data) => {
          setIsCreate(true);
          handleCloseModal();
        });
      } else {
        // setUserDataSource([value, ...userDataSource]);
        // handleAddUser(value);
        const payload = {
          universityId: parseInt(value.school, 10),
          name: value.name,
          role: value.role,
          status: value.status === "active",
          verify: value.verified,
          age: 22,
        };
        await UserService.updateUser(currRowFocus.id, payload).then((data) => {
          setIsUpdate(true);
          handleCloseModal();
        });
      }
      handleCloseModal();
    },
  });

  useEffect(() => {
    const getUserList = async () => {
      const result = await UserService.fetchUser();
      setUserDataSource(result?.data);
      setIsCreate(false);
      setIsUpdate(false);
      setIsDelete(false);
    };

    getUserList();
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
            User
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Iconify icon="eva:plus-fill" />}
            disabled={true}
          >
            New User
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
                rowCount={userDataSource.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {userDataSource.map((row, index) => {
                  const {
                    _id,
                    fullname,
                    email,
                    phone,
                    role,
                    status,
                    avatarUrl,
                    isVerified,
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
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                        >
                          <Avatar alt={fullname} src={avatarUrl} />
                          <Typography variant="subtitle2" noWrap>
                            {fullname}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">
                        {/* {universityDataSource.find(
                          (item) => item.id === universityId
                        )?.name || "-"} */}
                        {email}
                      </TableCell>

                      <TableCell align="left">{phone}</TableCell>
                      <TableCell align="left">{role === 0 ? "Admin" : "User"}</TableCell>

                      {/* <TableCell align="left">
                        {isVerified ? "Yes" : "No"}
                      </TableCell> */}

                      <TableCell align="left">
                        <Label color={!status ? "error" : "success"}>
                          {
                            (() => {
                              switch (status) {
                                case 0:
                                  return sentenceCase("banned");
                                case 1:
                                  return sentenceCase("active");
                                default:
                                  return sentenceCase("Unknown");
                              }
                            })()
                          }
                        </Label>
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
                          <br /> Try checking for typos or using complete
                          words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {/* </Scrollbar> */}

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userDataSource.length}
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
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* <MenuItem onClick={handleEditRow}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

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
            // helperText={formik.touched.name && formik.errors.name}
            />
            {/* <TextField
              fullWidth
              id="school"
              name="school"
              label="School"
              type="school"
              value={formik.values.school}
              onChange={formik.handleChange}
              error={formik.touched.school && Boolean(formik.errors.school)}
              helperText={formik.touched.school && formik.errors.school}
            /> */}

            <FormControl>
              <InputLabel id="demo-simple-select-label">School</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                onChange={formik.handleChange}
                fullWidth
                id="school"
                name="school"
                value={formik.values.school}
                label="School"
                type="school"
                error={formik.touched.school && Boolean(formik.errors.school)}
              // helperText={formik.touched.status && formik.errors.status}
              >
                {/* {universityDataSource.map(({ name, id }) => {
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })} */}
                {/* <MenuItem value={'active'}>Active</MenuItem>
                <MenuItem value={'banned'}>Banned</MenuItem> */}
                {/* <MenuItem value={2}>Thirty</MenuItem> */}
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText>; */}
            </FormControl>
            <TextField
              fullWidth
              id="role"
              name="role"
              label="Role"
              type="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
            // helperText={formik.touched.role && formik.errors.role}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                onChange={formik.handleChange}
                fullWidth
                id="status"
                name="status"
                value={formik.values.status}
                label="Status"
                type="status"
                error={formik.touched.status && Boolean(formik.errors.status)}
              // helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"banned"}>Banned</MenuItem>
                {/* <MenuItem value={2}>Thirty</MenuItem> */}
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText>; */}
            </FormControl>
            <TextField
              fullWidth
              id="verified"
              name="verified"
              label="Verified"
              type="verified"
              value={formik.values.verified}
              onChange={formik.handleChange}
              error={formik.touched.verified && Boolean(formik.errors.verified)}
            // helperText={formik.touched.verified && formik.errors.verified}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button> */}
          {/* <Button onClick={handleCloseModal}>Close</Button> */}
        </DialogActions>
        {/* </Box> */}
      </Dialog>
    </>
  );
}
