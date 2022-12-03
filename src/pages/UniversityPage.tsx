import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { useLazyAxios } from 'use-axios-client'
import {
  Card,
  Box,
  Table,
  Stack,
  Paper,
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
  DialogTitle,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { faker } from '@faker-js/faker';
import { UniversityListHead, UniversityListToolbar } from '../sections/@dashboard/university';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { fetchUniversity, createUniversity, updateUniversity, deleteUniversity } from '../hooks/university';

const TABLE_HEAD = [
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: '' },
];

const validationSchema = yup.object({
  code: yup.string().required('Code is required').matches(/^[A-Za-z]+$/, 'Code must have no space or special character'),
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
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
  return order === 'desc'
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UniversityPage() {

  const [data, setData]= useState([])

  const [open, setOpen] = useState(null);
  const [openId, setOpenId] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setOpenModal] = useState(false);

  const [currRowFocus, setCurrRowFocus] = useState(null);

  const [filteredUniversities, setFilteredUniversities]= useState([]);

  const [isCreate, setIsCreate]= useState(false);

  const [isUpdate, setIsUpdate]= useState(false);

  const [isDelete, setIsDelete]= useState(false);

  useEffect(()=> {
    const getData= async () => {
      const result= await fetchUniversity();

      setData(result?.data);

      setIsCreate(false);
      setIsUpdate(false);
      setIsDelete(false);
    }

    getData();
  }, [isCreate, isUpdate, isDelete])

  useEffect(()=> {
    if(data) {
      const filteredUniversities = applySortFilter(data, getComparator(order, orderBy), filterName);

      setFilteredUniversities(filteredUniversities);
    }

  }, [data])

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = (e) => {
    setOpenModal(false)
    formik.handleReset(e);
    setCurrRowFocus(null);
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setOpenId(row.id);
    setCurrRowFocus(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenId(null);
    setCurrRowFocus(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteUni= async (id)=> {

    setOpen(null);
    setOpenId(null);
    setCurrRowFocus(null);

    await deleteUniversity(id);

    setIsDelete(true)
  }

  const handleEditRow = () => {
    setOpenModal(true);
    formik.setValues(currRowFocus);
    setOpen(null);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const isNotFound = !filteredUniversities.length && !!filterName;

  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      address: '',
    },
    validationSchema,
    onSubmit: async (values: any) => {

      if (!currRowFocus) {
        const newUni= {...values, code: values.code.toUpperCase()};

       await createUniversity(newUni);

       setIsCreate(true);
      } else {
       await updateUniversity(values.id, values);

       setIsUpdate(true);
      }

      handleCloseModal(values);
    },
  });


  return (
    <>
      <Helmet>
        <title> University | Minimal UI </title>
      </Helmet>

      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Univeristy
          </Typography>
          <Button variant="contained" onClick={handleOpenModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Univeristy
          </Button>
      </Stack>

      <Card>
          <UniversityListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UniversityListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUniversities?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                    const { id, code, name, address } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{address}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event)=>handleOpenMenu(event, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
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
                            textAlign: 'center',
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
          </>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditRow}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick= {()=> handleDeleteUni(openId)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog fullWidth={false} open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{currRowFocus ? 'Edit University' : 'Create New University'}</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '100%',
              '& .MuiFormControl-root': { m: 1, width: '400px' },
            }}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              fullWidth
              id="code"
              name="code"
              label="Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              // helperText={formik.touched.code && formik.errors.code}
            />
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              type="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              // helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              type="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color="primary" variant="contained" type="submit" onClick={formik.handleSubmit}>
            Submit
          </Button> */}
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
