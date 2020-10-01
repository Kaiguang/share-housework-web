import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { API } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import { userProfileState, navBarTitleState } from "../atoms.js";
import config from "../config.js";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  dialogElement: {
    marginBottom: `10px`,
  },
  card: {
    marginBottom: `10px`,
  },
});

export default function Settings() {
  const classes = useStyles();
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const setNavBarTitle = useSetRecoilState(navBarTitleState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState("");
  const [choreToEdit, setChoreToEdit] = useState({
    Chore: null,
    Cents: null,
    Id: null,
  });

  useEffect(() => {
    setNavBarTitle("Settings");
  }, [setNavBarTitle]);

  const handleEditNicknameButtonClick = () => {
    setIsNicknameDialogOpen(true);
    setTempNickname(userProfile.CanConfirmWhom.Nickname);
  };

  const handleNicknameEditChange = (event) => {
    setTempNickname(event.target.value);
  };

  const handleNicknameDialogSave = () => {
    const updatedUserProfile = {
      ...userProfile,
      CanConfirmWhom: {
        ...userProfile.CanConfirmWhom,
        Nickname: tempNickname,
      },
    };

    API.put(config.Amplify.API.endpoints[0].name, "/putUserProfile", {
      body: updatedUserProfile,
    })
      .then(() => {
        setIsNicknameDialogOpen(false);
        setUserProfile(updatedUserProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChoreClick = (choreId) => {
    const chore = userProfile.CanPerformChores.filter(
      (item) => item.Id === choreId
    )[0];
    setChoreToEdit(chore);
    setIsDialogOpen(true);
  };

  const handleChoreToEditChange = (event) => {
    setChoreToEdit({
      ...choreToEdit,
      Chore: event.target.value,
    });
  };

  const handlePriceChange = (event) => {
    setChoreToEdit({
      ...choreToEdit,
      Cents: Math.round(event.target.value * 100).toString(),
    });
  };

  const handleDialogSave = () => {
    let updatedChores = [];

    for (let i = 0; i <= userProfile.CanPerformChores.length; i++) {
      if (userProfile.CanPerformChores.length === 0) {
        updatedChores.push();
        updatedChores.push(choreToEdit);
        break;
      } else if (i === userProfile.CanPerformChores.length) {
        updatedChores = [...userProfile.CanPerformChores];
        updatedChores.push(choreToEdit);
        break;
      } else if (userProfile.CanPerformChores[i].Id === choreToEdit.Id) {
        updatedChores = [...userProfile.CanPerformChores];
        updatedChores[i] = choreToEdit;
        break;
      }
    }

    const updatedUserProfile = {
      ...userProfile,
      CanPerformChores: updatedChores,
    };

    API.put(config.Amplify.API.endpoints[0].name, "/putUserProfile", {
      body: updatedUserProfile,
    })
      .then(() => {
        setIsDialogOpen(false);
        setUserProfile(updatedUserProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDialogDelete = () => {
    const updatedChores = userProfile.CanPerformChores.filter(
      (chore) => chore.Id !== choreToEdit.Id
    );
    const updatedUserProfile = {
      ...userProfile,
      CanPerformChores: updatedChores,
    };

    API.put(config.Amplify.API.endpoints[0].name, "/putUserProfile", {
      body: updatedUserProfile,
    })
      .then(() => {
        setIsDialogOpen(false);
        setUserProfile(updatedUserProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddANewOne = () => {
    setChoreToEdit({ Chore: "", Cents: "", Id: Date.now().toString() });
    setIsDialogOpen(true);
  };

  return (
    <>
      <List>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Nickname for my roommate
            </Typography>
            <Typography>{userProfile.CanConfirmWhom.Nickname}</Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleEditNicknameButtonClick}
              variant="outlined"
              size="small"
            >
              Edit
            </Button>
          </CardActions>
        </Card>

        <Dialog
          open={isNicknameDialogOpen}
          onClose={() => setIsNicknameDialogOpen(false)}
        >
          <DialogContent>
            <TextField
              className={classes.dialogElement}
              fullWidth
              label="Nickname"
              value={tempNickname}
              variant="outlined"
              onChange={handleNicknameEditChange}
            />
            <Button
              className={classes.dialogElement}
              variant="outlined"
              fullWidth
              onClick={handleNicknameDialogSave}
            >
              Save
            </Button>
            <Button
              className={classes.dialogElement}
              variant="outlined"
              fullWidth
              onClick={() => setIsNicknameDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>

        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              My chores to perform
            </Typography>
          </CardContent>
          {userProfile.CanPerformChores.map((chore) => (
            <ListItem
              key={chore.Id}
              button
              divider
              onClick={() => handleChoreClick(chore.Id)}
            >
              <ListItemText
                primary={chore.Chore}
                secondary={`$ ${chore.Cents / 100}`}
              />
            </ListItem>
          ))}
          <ListItem button onClick={handleAddANewOne}>
            <ListItemText secondary="ADD A NEW ONE" />
          </ListItem>
        </Card>
      </List>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <TextField
            className={classes.dialogElement}
            fullWidth
            label="Chore"
            value={choreToEdit.Chore}
            variant="outlined"
            onChange={handleChoreToEditChange}
          />
          <TextField
            className={classes.dialogElement}
            fullWidth
            type="number"
            label="Price $"
            value={`${choreToEdit.Cents / 100}`}
            variant="outlined"
            onChange={handlePriceChange}
          />
          <Button
            className={classes.dialogElement}
            variant="outlined"
            fullWidth
            onClick={handleDialogSave}
          >
            Save
          </Button>
          <Button
            className={classes.dialogElement}
            variant="outlined"
            fullWidth
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={classes.dialogElement}
            variant="outlined"
            fullWidth
            color="secondary"
            onClick={handleDialogDelete}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
