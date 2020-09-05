import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Grid from "@material-ui/core/Grid";

import NavBar from "./NavBar";
import { isSignedInState } from "../atoms";

export default function PrivateRoute({ children, ...rest }) {
  const isSignedIn = useRecoilValue(isSignedInState);

  return (
    <>
      <Grid item xs={12}>
        <NavBar />
      </Grid>
      <Route
        {...rest}
        render={({ location }) =>
          isSignedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/SignIn",
                state: { from: location },
              }}
            />
          )
        }
      />
    </>
  );
}
