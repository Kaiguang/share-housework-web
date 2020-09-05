import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { Auth } from "aws-amplify";

import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { isSignedInState, userProfileState } from "../atoms";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
  const userProfile = useRecoilValue(userProfileState);

  useEffect(() => {
    Auth.currentSession()
      .then(() => {
        setIsSignedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setIsSignedIn(false);
      });
  }, [setIsSignedIn]);

  return (
    <Box>
      <Typography variant="h4" component="h1">
        Share Housework
      </Typography>
      {isSignedIn ? (
        <>
          <Typography>{userProfile.Username}</Typography>
          <Link component={RouterLink} to="/MyChores">
            Go to my chores
          </Link>
          <Box>
            <Link component={RouterLink} to="/SignOut">
              Sign out
            </Link>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Link component={RouterLink} to="/SignIn">
              Sign in
            </Link>
          </Box>
          <Box>
            <Link component={RouterLink} to="/SignUp">
              Sign up
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
}
