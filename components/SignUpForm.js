import React, { useState } from 'react';
import Router from 'next/router';
import 'isomorphic-fetch';
import useImportForm from '../hooks/useFormInput.js';

const SignUpForm = () => {
  const [username, handleUsername] = useImportForm("");
  const [password, handlePassword, resetPassword] = useImportForm("");
  const [passwordConf, handlePasswordConf, resetPasswordConf] = useImportForm("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

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
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input type="text" name="username" value={username} onChange={handleUsername} placeholder="Username" />
      <small>{errors.username}</small>

      <label>Password</label>
      <input type="password" name="password" value={password} onChange={handlePassword} placeholder="Password" />
      <small>{errors.password}</small>

      <label>Password confirmation</label>
      <input type="password" name="passwordConfirmation" value={passwordConf} onChange={handlePasswordConf} placeholder="Password confirmation" />
      <small>{errors.passwordConf}</small>

      <button type="submit">Sign up</button>
    </form>
  );
}
 
export default SignUpForm;