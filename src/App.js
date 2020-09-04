import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

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

export default function App() {
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
