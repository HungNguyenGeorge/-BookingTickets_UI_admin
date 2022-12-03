import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import * as AuthenService from "../../../hooks/auth";
import { AuthContext } from '../../../context/AuthContext';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


// ----------------------------------------------------------------------

export default function RegisterForm({ onSuccess }) {
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await AuthenService.register(credentials);
      MySwal.fire({
        title: <p>Register successful!</p>,
        text: `Congratulations to ${res.data.fullname}, login to booking`,
        icon: "success"
      }).then(_ => {
        onSuccess(res.data);
      })
    } catch (err) {
      console.log("🚀 ~ file: LoginForm.tsx:37 ~ handleClick ~ err", err)
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          id='email'
          label="Email address"
          onChange={handleChange}
        />

        <TextField
          name="password"
          id='password'
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="fullname"
          id='fullname'
          label="Full Name"
          type="Text"
          onChange={handleChange}
        />
        <TextField
          name="phone"
          id='phone'
          label="Phone"
          type="number"
          onChange={handleChange}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ marginTop: 7 }} onClick={handleClick} loading={loading}>
        Register
      </LoadingButton>
    </>
  );
}
