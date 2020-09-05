import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { isSignedInState, userProfileState } from "../atoms";

export default function Home() {
  const isSignedIn = useRecoilValue(isSignedInState);
  const userProfile = useRecoilValue(userProfileState);

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
