import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { API } from "aws-amplify";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { userProfileState } from "../atoms.js";
import config from "../config.js";

export default function AddChoreDialog(props) {
  const userProfile = useRecoilValue(userProfileState);
  const [isLoading, setIsLoading] = useState(false);

  const postChoreToDb = (chore) => {
    setIsLoading(true);

    API.post(config.Amplify.API.endpoints[0].name, "/createChore", {
      body: { chore: chore.Chore, cents: chore.Cents },
    })
      .then(() => {
        props.onClose();
        props.fetchMyChores();
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{isLoading ? `Adding chore...` : `Add a chore`}</DialogTitle>
      {isLoading ? null : (
        <List>
          {userProfile.CanPerformChores.map((chore) => (
            <ListItem
              key={chore.Id}
              button
              onClick={() => postChoreToDb(chore)}
            >
              <ListItemText
                primary={chore.Chore}
                secondary={`$ ${chore.Cents / 100}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Dialog>
  );
}
