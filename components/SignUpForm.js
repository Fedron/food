import React, { useState } from 'react';
import useImportForm from '../hooks/useFormInput.js';

const SignUpForm = () => {
  const [email, handleEmail] = useImportForm("");
  const [password, handlePassword, resetPassword] = useImportForm("");
  const [passwordConf, handlePasswordConf, resetPasswordConf] = useImportForm("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConf: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();


    let updatedErrors = {
      email: "",
      password: "",
      passwordConf: ""
    };

    if (!email) {
      updatedErrors = {...updatedErrors, email: "Please enter an email"};
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

    if (updatedErrors !== errors) {
      setErrors(updatedErrors);
    } else {
      console.log("signup successful");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input type="email" name="email" value={email} onChange={handleEmail} placeholder="Email" />
      <small>{errors.email}</small>

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