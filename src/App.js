import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import { useSetRecoilState, useRecoilState } from "recoil";

import Home from "./pages/Home";
import LinkARoommate from "./pages/LinkARoommate";
import MyChores from "./pages/MyChores";
import NotFound from "./pages/NotFound";
import PayeesChores from "./pages/PayeesChores";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import SignUp from "./pages/SignUp";
import SignUpConfirmation from "./pages/SignUpConfirmation";

import PrivateRoute from "./components/PrivateRoute";
import { isSignedInState, userProfileState } from "./atoms";
import config from "./config.js";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
  const setUserProfile = useSetRecoilState(userProfileState);

  useEffect(() => {
    Auth.currentSession()
      .then(() => {
        setIsSignedIn(true);
        return API.get(config.Amplify.API.endpoints[0].name, "/getUserProfile");
      })
      .then((data) => {
        setUserProfile(data.Item);
      })
      .catch((error) => {
        console.log(error);
        setIsSignedIn(false);
      });
  }, [setIsSignedIn, setUserProfile, isSignedIn]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/SignIn">
          <SignIn />
        </Route>
        <Route path="/SignUp">
          <SignUp />
        </Route>
        <Route path="/SignUpConfirmation/:username">
          <SignUpConfirmation />
        </Route>
        <Route path="/SignOut">
          <SignOut />
        </Route>
        <PrivateRoute path="/SignOut">
          <SignOut />
        </PrivateRoute>
        <PrivateRoute path="/MyChores">
          <MyChores />
        </PrivateRoute>
        <PrivateRoute path="/LinkARoommate">
          <LinkARoommate />
        </PrivateRoute>
        <PrivateRoute path="/PayeesChores">
          <PayeesChores />
        </PrivateRoute>
        <PrivateRoute path="/Settings">
          <Settings />
        </PrivateRoute>
        <Route path="/*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
