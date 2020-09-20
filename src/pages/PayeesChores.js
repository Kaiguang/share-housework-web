import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import { isSignedInState, navBarTitleState, userProfileState } from "../atoms";
import config from "../config.js";

const useStyles = makeStyles({
  loadingIndicator: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    padding: "10px",
    marginBottom: `10px`,
  },
  choreRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function PayeeChores() {
  const classes = useStyles();
  const setIsSignedIn = useSetRecoilState(isSignedInState);
  const setNavBarTitle = useSetRecoilState(navBarTitleState);
  const userProfile = useRecoilValue(userProfileState);
  const [payeesChores, setPayeesChores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setNavBarTitle(`${userProfile.CanConfirmWhom.Nickname}'s Chores`);
  }, [setNavBarTitle, userProfile.CanConfirmWhom.Nickname]);

  useEffect(() => {
    async function getPayeesChores() {
      const getChoresPromise = API.get(config.Amplify.API.endpoints[0].name, "/getPayeesChores");

      try {
        setPayeesChores(await getChoresPromise);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsSignedIn(false);
      }

      return getChoresPromise;
    }

    const getChoresPromise = getPayeesChores();

    return () =>
      API.cancel(
        getChoresPromise,
        "GET /getPayeesChores was cancelled from useEffect hook due to component unmount."
      );
  }, [setIsSignedIn]);

  return (
    <List>
      {isLoading ? (
        <Box className={classes.loadingIndicator}>
          <CircularProgress />
        </Box>
      ) : (
        payeesChores.Items.map((item) => (
          <Chore key={item.TimeCreated} chore={item} />
        ))
      )}
    </List>
  );
}

function Chore(props) {
  const classes = useStyles();
  const [chore, setChore] = useState(props.chore);

  const handleConfirmChoreClick = () => {
    API.put(config.Amplify.API.endpoints[0].name, "/confirmChorePerformance", {
      body: {
        timeCreated: chore.TimeCreated,
      },
    })
      .then((data) => {
        if (data.message === "Chore performance confirmed") {
          const updatedChore = { ...chore, IsConfirmed: true };
          setChore(updatedChore);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Paper key={chore.TimeCreated} className={classes.paper}>
      <Box className={classes.choreRow}>
        <Typography component="span">{`${chore.Chore} `}</Typography>
        <Typography variant="caption" color="textSecondary">
          {new Date(Number(chore.TimeCreated)).toDateString()}
        </Typography>
      </Box>

      <Box className={classes.choreRow}>
        <Typography component="span">${chore.Cents / 100}</Typography>
        <Typography
          component="span"
          color={chore.IsConfirmed ? "primary" : "textSecondary"}
        >
          {chore.IsConfirmed ? "Confirmed" : "Not Confirmed"}
        </Typography>

        {!chore.IsPaid && !chore.IsConfirmed ? (
          <Button
            variant="outlined"
            size="small"
            onClick={handleConfirmChoreClick}
          >
            Confirm
          </Button>
        ) : null}

        {!chore.IsPaid && chore.IsConfirmed ? (
          <Typography color="textSecondary">Not Paid</Typography>
        ) : null}
      </Box>
    </Paper>
  );
}
