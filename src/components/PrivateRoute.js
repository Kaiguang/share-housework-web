import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { API, Auth } from "aws-amplify";

import Grid from "@material-ui/core/Grid";

import NavBar from "./NavBar";
import { isSignedInState, userProfileState } from "../atoms";
import config from "../config.js";

export default function PrivateRoute({ children, ...rest }) {
  const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
  const setUserProfile = useSetRecoilState(userProfileState);

  useEffect(() => {
    Auth.currentSession()
      .then(() => {
        setIsSignedIn(true);
        return API.get(config.Amplify.API.endpoints[0].name, "/user_profile");
      })
      .then((data) => {
        setUserProfile(data.Item);
      })
      .catch((error) => {
        console.log(error);
        setIsSignedIn(false);
      });
  }, [setIsSignedIn, setUserProfile]);

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
