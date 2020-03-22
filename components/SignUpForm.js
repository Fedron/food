import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import 'isomorphic-fetch';
import useImportForm from '../hooks/useFormInput.js';
import useStyles from './styles/authStyles.js';

const SignUpForm = () => {
  const [username, handleUsername] = useImportForm("");
  const [password, handlePassword, resetPassword] = useImportForm("");
  const [passwordConf, handlePasswordConf, resetPasswordConf] = useImportForm("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedErrors = {};

    if (!username) {
      updatedErrors = {...updatedErrors, username: "Please enter a username"};
    } else if (username.length < 5) {
      updatedErrors = {...updatedErrors, username: "Your username must be atleast 5 characters long"};
    }

    if (!password) {
      updatedErrors = {...updatedErrors, password: "Please enter a password"};
    } else if (password.length < 8) {
      updatedErrors = {...updatedErrors, password: "Password must be atleast 8 characters long"};
      resetPassword();
    }

    if (passwordConf !== password || !passwordConf) {
      updatedErrors = {...updatedErrors, passwordConf: "Does not match password"};
      resetPasswordConf();
    }

    if (Object.keys(updatedErrors).length > 0) {
      setErrors(updatedErrors);
    } else {
      fetch("/signup", {
        method: "post",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, passwordConf })
      }).then((res) => {
        if (res.status === 200) {
          Router.push("/");
        } else {
          setErrors({...errors, username: res.statusText});
          resetPassword();
        }
      });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={handleUsername}
          />
          {errors.username &&
            <Typography className={classes.error}>{errors.username}</Typography>
          }
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
          />
          {errors.password &&
            <Typography className={classes.error}>{errors.password}</Typography>
          }
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="passwordConf"
            label="Password Confirmation"
            type="password"
            name="passwordConf"
            value={passwordConf}
            onChange={handlePasswordConf}
          />
          {errors.passwordConf &&
            <Typography className={classes.error}>{errors.passwordConf}</Typography>
          }

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>

        <Link href="/signin"><a>Already got an account? Sign in here</a></Link>
      </div>
    </Container>
  );
}
 
export default SignUpForm;