import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles({
  appTitle: {
    fontSize: `20px`,
    paddingTop: `32px`,
  },
  heading1: {
    fontSize: `16px`,
    paddingBottom: `16px`,
  },
  button: {
    marginTop: `16px`,
    marginBottom: `16px`,
  },
});

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };

  const handleSignUpClick = () => {
    Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    })
      .then(() => {
        history.push(`/SignUpConfirmation/${email}`);
      })
      .catch((error) => {
        console.log(error);
        if (error.message) {
          alert(error.message);
        }
      });
  };

  return (
    <Container maxWidth="xs">
      <Link component={RouterLink} to="/">
        <Typography className={classes.appTitle} color="primary" align="center">
          SHARE HOUSEWORK
        </Typography>
      </Link>
      <Typography className={classes.heading1} component="h1" align="center">
        Sign up
      </Typography>
      <form noValidate>
        <TextField
          autoComplete="email"
          autoFocus
          fullWidth
          id="email"
          label="Email"
          margin="normal"
          name="email"
          onChange={handleEmailChange}
          required
          value={email}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          margin="normal"
          name="password"
          onChange={handlePasswordChange}
          required
          type="password"
          value={password}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="confirm-password"
          label="Confirm Password"
          margin="normal"
          name="confirm-password"
          onChange={handlePasswordConfirmationChange}
          required
          type="password"
          value={passwordConfirmation}
          variant="outlined"
        />
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={handleSignUpClick}
          size="large"
          variant="outlined"
        >
          Sign Up
        </Button>
        <Link component={RouterLink} to="/SignIn">
          I have an account, let me sign in
        </Link>
      </form>
    </Container>
  );
}
