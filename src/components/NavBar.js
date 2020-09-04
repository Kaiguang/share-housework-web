import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import MenuRoundedIcon from "@material-ui/icons/MenuRounded";

import { navBarTitleState, userProfileState } from "../atoms.js";
import "./NavBar.css";

export default function NavBar() {
  const history = useHistory();
  const navBarTitle = useRecoilValue(navBarTitleState);
  const userProfile = useRecoilValue(userProfileState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleDrawerListItemClick = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(false);
    if (item === "My Chores") {
      history.push("/MyChores");
    } else if (item === `${userProfile.CanConfirmWhom.Nickname}'s Chores`) {
      history.push("/PayeesChores");
    } else if (item === "Link a roommate") {
      history.push("/LinkARoommate");
    } else if (item === `Settings`) {
      history.push("/Settings");
    }
  };
  const handleSignOut = () => {
    history.push("/SignOut");
  };

  return (
    <>
      <AppBar id="app-bar" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Menu"
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" component="span">
            {navBarTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Paper square id="username">
          <Typography align="center">{userProfile.Username}</Typography>
        </Paper>
        <List>
          <ListItem
            button
            onClick={() => handleDrawerListItemClick("My Chores")}
            selected={"My Chores" === selectedItem}
          >
            <ListItemText>My Chores</ListItemText>
          </ListItem>

          {userProfile.CanConfirmWhom.Username ? (
            <ListItem
              button
              onClick={() =>
                handleDrawerListItemClick(
                  `${userProfile.CanConfirmWhom.Nickname}'s Chores`
                )
              }
              selected={
                `${userProfile.CanConfirmWhom.Nickname}'s Chores` ===
                selectedItem
              }
            >
              <ListItemText>{`${userProfile.CanConfirmWhom.Nickname}'s Chores`}</ListItemText>
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={() => handleDrawerListItemClick("Link a roommate")}
              selected={selectedItem === "Link a roommate"}
            >
              <ListItemText>Link a roommate</ListItemText>
            </ListItem>
          )}

          <Divider />

          <ListItem
            button
            onClick={() => handleDrawerListItemClick("Settings")}
            selected={"Settings" === selectedItem}
          >
            <ListItemText>Settings</ListItemText>
          </ListItem>

          <ListItem button onClick={() => handleSignOut()}>
            <ListItemText>Sign Out</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
