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

const SignInForm = () => {
  const [username, handleUsername, resetUsername] = useImportForm("");
  const [password, handlePassword, resetPassword] = useImportForm("");

  const [error, setError] = useState("");

  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();

    let updatedError = "";

    if (!username || !password) {
      updatedError = "Fields cannot be left blank";
    }

    if (updatedError) {
      setError(updatedError);
    } else {
      fetch("/signin", {
        method: "post",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      }).then((res) => {
        if (res.status === 200) {
          Router.push("/");
        } else {
          setError(res.statusText);
          resetUsername();
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
        <Typography component="h1" variant="h5">Sign In</Typography>
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

          {error &&
            <Typography className={classes.error} style={{ textAlign: "center" }}>{error}</Typography>
          }

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>

        <Link href="/signup"><a>Don't have an account? Sign up here</a></Link>
      </div>
    </Container>
  );
}
 
export default SignInForm;