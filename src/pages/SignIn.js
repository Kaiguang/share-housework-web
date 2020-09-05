import React, { useState } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";

import { isSignedInState } from "../atoms";

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

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const setIsSignedIn = useSetRecoilState(isSignedInState);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    Auth.signIn(email, password)
      .then(() => {
        setIsSignedIn(true);
        history.push("/MyChores");
      })
      .catch((error) => {
        alert(error.message);
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
        Sign in
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
          autoComplete="current-password"
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
        <Button
          color="primary"
          fullWidth
          className={classes.button}
          onClick={handleSignIn}
          size="large"
          type="submit"
          variant="outlined"
        >
          Sign In
        </Button>
        <Link component={RouterLink} to="/SignUp">
          I don't have an account, let me sign up
        </Link>
      </form>
    </Container>
  );
}
