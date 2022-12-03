import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, Drawer, Link, Divider, styled } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { EventCard, EventsSort, EventsSearch } from '../sections/@dashboard/event';
// mock
import POSTS from '../_mock/blog';
import { Fragment, useContext, useEffect, useState } from 'react';
import * as Events from '../hooks/event';
import BookingForm from '../sections/@dashboard/event/BookingEvent'

import { AuthContext } from '../context/AuthContext';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));


export default function BlogPage() {

  const [openBooking, setOpenBooking] = useState(false);
  const [events, setEvents] = useState(POSTS);
  const [currEvent, setCurrEvent] = useState(null)
  const { user, dispatch } = useContext(AuthContext);

  const handleOpenBookings = (event) => {
    if (!user) {
      dispatch({ type: 'TRIGGER_LOGIN' });
      return;
    }
    setOpenBooking(true);
    setCurrEvent(event);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const resEvent = await Events.getAllEvents(null)
        setEvents(resEvent.data);
      } catch (err) {
        console.log("🚀 ~ file: LoginForm.tsx:37 ~ handleClick ~ err", err)
      }
    }
    getData();
    return () => {

    }
  }, [])

  const onCloseBooking = () => {
    setOpenBooking(false);
  }


  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setOpenBooking(open);
      };


  return (
    <>
      <Helmet>
        <title> Booking App </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Events
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button> */}
        </Stack>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <EventsSearch posts={events} />
          <EventsSort options={SORT_OPTIONS} />
        </Stack> */}

        <Grid container spacing={3}>
          {events.map((event, index) => (
            <EventCard key={index} event={event} index={index} onBooking={_ => handleOpenBookings(event)} />
          ))}
        </Grid>


        <Fragment>
          <Drawer
            anchor={"left"}
            open={openBooking}
            onClose={toggleDrawer(false)}
            PaperProps={{

              sx: {
                width: 500,
                height: "unset",
                p: 5
              }
            }}
          >
            <BookingForm event={currEvent} onClose={onCloseBooking} />
          </Drawer>

        </Fragment>


      </Container>
    </>
  );
}
