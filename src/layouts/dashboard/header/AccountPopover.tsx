import { Fragment, useContext, useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Link, Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Drawer, Container, Button } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../../sections/auth/login';
import { RegisterForm } from '../../../sections/auth/register';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
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

export default function AccountPopover() {
  const navigate = useNavigate();
  const [openAccountPopover, setOpenAccountPopover] = useState(null);
  const [openLoginDrawer, setOpenLoginDrawer] = useState(false);
  const [openRegisterDrawer, setOpenRegisterDrawer] = useState(false);
  const { user, dispatch, openLogin } = useContext(AuthContext);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (user) {
      setOpenLoginDrawer(false)
    }
    return () => {
      setOpenLoginDrawer(false)
    }
  }, [user])

  useEffect(() => {
    if (openLogin) {
      setOpenLoginDrawer(true);
    } else {
      return;
    }
  }, [openLogin])


  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
  }
  const handleRegisterSuccess = (newUser) => {
    setOpenLoginDrawer(true);
    setOpenRegisterDrawer(false);
    dispatch({ type: "LOGOUT" });
  }

  const handleOpen = (event) => {
    setOpenAccountPopover(event.currentTarget);
  };

  const handleClose = () => {
    setOpenAccountPopover(null);
  };

  const toggleOpenLogin = () => {
    setOpenLoginDrawer(true);
    toggleDrawer(true);
    setOpenAccountPopover(false)
  };

  const toggleOpenRegister = () => {
    setOpenRegisterDrawer(true);
    toggleDrawer(true);
    setOpenAccountPopover(false)
  };

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setOpenLoginDrawer(open);
        dispatch({ type: 'LOGOUT' })
      };

  const toggleRegisterDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setOpenRegisterDrawer(open);
        dispatch({ type: 'LOGOUT' })
      };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(openAccountPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(openAccountPopover)}
        anchorEl={openAccountPopover}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 250,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {
          user ? (
            <>
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                  {user?.fullname || "-"}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user?.email || "-"}
                </Typography>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack sx={{ p: 1 }}>
                {MENU_OPTIONS.map((option) => (
                  <MenuItem key={option.label} onClick={handleClose}>
                    {option.label}
                  </MenuItem>
                ))}
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <MenuItem onClick={() => handleLogout()} sx={{ m: 1 }}>
                Logout
              </MenuItem>
            </>

          ) : (
            <>
              <MenuItem onClick={_ => toggleOpenLogin()} sx={{ m: 1 }}>
                Login
              </MenuItem>
              <MenuItem onClick={() => toggleOpenRegister()} sx={{ m: 1 }}>
                Register
              </MenuItem>
            </>
          )
        }
      </Popover>


      <div>
        <Fragment>
          <Drawer
            anchor={"right"}
            open={openLoginDrawer}
            onClose={toggleDrawer(false)}
            PaperProps={{

              sx: {
                width: 500,
                p: 5
              }
            }}
          >
            <Container maxWidth="sm">
              <StyledContent>
                <Typography variant="h4" gutterBottom>
                  Sign in to Booking
                </Typography>

                <Typography variant="body2" sx={{ mb: 5 }}>
                  Don’t have an account? {''}
                  <Link variant="subtitle2" sx={{ cursor: "pointer" }} onClick={_ => {
                    setOpenLoginDrawer(false);
                    setOpenRegisterDrawer(true);
                  }}>Get started</Link>
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button fullWidth size="large" color="inherit" variant="outlined" disabled={true}>
                    <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                  </Button>

                  <Button fullWidth size="large" color="inherit" variant="outlined" disabled={true}>
                    <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                  </Typography>
                </Divider>

                <LoginForm />
              </StyledContent>
            </Container>
          </Drawer>

          <Drawer
            anchor={"right"}
            open={openRegisterDrawer}
            onClose={toggleRegisterDrawer(false)}
            PaperProps={{

              sx: {
                width: 500,
                p: 5
              }
            }}
          >
            <Container maxWidth="sm">
              <StyledContent>
                <Typography variant="h4" gutterBottom>
                  Sign on to Booking
                </Typography>

                <Typography variant="body2" sx={{ mb: 5 }}>
                  Have an account? {''}
                  <Link variant="subtitle2" sx={{ cursor: "pointer" }} onClick={_ => {
                    setOpenLoginDrawer(true);
                    setOpenRegisterDrawer(false);
                  }}>Let's start</Link>
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button fullWidth size="large" color="inherit" variant="outlined" disabled={true}>
                    <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                  </Button>

                  <Button fullWidth size="large" color="inherit" variant="outlined" disabled={true}>
                    <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                  </Typography>
                </Divider>

                <RegisterForm onSuccess={(newUser) => handleRegisterSuccess(newUser)} />
              </StyledContent>
            </Container>
          </Drawer>

        </Fragment>
      </div>
    </>
  );
}
