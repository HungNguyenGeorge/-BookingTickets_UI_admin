import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import * as AuthenService from "../../../hooks/auth";
import { AuthContext } from '../../../context/AuthContext';

// ----------------------------------------------------------------------

export default function LoginForm() {
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
      const res = await AuthenService.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate('/dashboard', { replace: false });
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={loading}>
        Login
      </LoadingButton>
    </>
  );
}
