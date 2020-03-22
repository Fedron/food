import React, { useState } from 'react';
import Router from 'next/router';
import 'isomorphic-fetch';
import useImportForm from '../hooks/useFormInput.js';

const SignInForm = () => {
  const [username, handleUsername, resetUsername] = useImportForm("");
  const [password, handlePassword, resetPassword] = useImportForm("");

  const [error, setError] = useState("");

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
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input type="text" name="username" value={username} onChange={handleUsername} placeholder="Username" />

      <label>Password</label>
      <input type="password" name="password" value={password} onChange={handlePassword} placeholder="Password" />
      
      <h5>{error}</h5>
      <button type="submit">Sign in</button>
    </form>
  );
}
 
export default SignInForm;