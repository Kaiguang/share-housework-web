import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
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

export default function SignUpConfirmation() {
  const classes = useStyles();
  const history = useHistory();
  const [verificationCode, setVerificationCode] = useState("");
  const { username } = useParams();

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleConfirmationClick = (event) => {
    Auth.confirmSignUp(username, verificationCode)
      .then(() => {
        history.push("/SignIn");
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
        Sign up confirmation for {username}
      </Typography>
      <form noValidate>
        <TextField
          autoFocus
          fullWidth
          id="verificationCode"
          label="Verification Code"
          margin="normal"
          name="verificationCode"
          onChange={handleVerificationCodeChange}
          required
          value={verificationCode}
          variant="outlined"
        />
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={handleConfirmationClick}
          size="large"
          variant="outlined"
        >
          Confirm
        </Button>
      </form>
    </Container>
  );
}
