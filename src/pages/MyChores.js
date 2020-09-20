import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { useSetRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";

import { isSignedInState, navBarTitleState } from "../atoms.js";
import AddChoreDialog from "../components/AddChoreDialog.js";
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
  fab: {
    position: "fixed",
    bottom: `20px`,
    right: `20px`,
  },
});

export default function MyChores() {
  const classes = useStyles();
  const setIsSignedIn = useSetRecoilState(isSignedInState);
  const setNavBarTitle = useSetRecoilState(navBarTitleState);
  const [myChores, setMyChores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddChoreDialogOpen, setIsAddChoreDialogOpen] = useState(false);

  const handleAddChoreDialogClose = () => {
    setIsAddChoreDialogOpen(false);
  };

  const handleNewChoreIconClick = () => {
    setIsAddChoreDialogOpen(true);
  };

  useEffect(() => {
    setNavBarTitle(`My Chores`);
  }, [setNavBarTitle]);

  const fetchMyChores = () => {
    API.get(config.Amplify.API.endpoints[0].name, "/getChores")
      .then((data) => {
        setMyChores(data.Items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSignedIn(false);
      });
  };

  useEffect(fetchMyChores, []);

  return (
    <List>
      {isLoading ? (
        <Box className={classes.loadingIndicator}>
          <CircularProgress />
        </Box>
      ) : (
        myChores.map((item) => <Chore key={item.TimeCreated} chore={item} />)
      )}
      <Fab
        onClick={handleNewChoreIconClick}
        color="primary"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
      <AddChoreDialog
        open={isAddChoreDialogOpen}
        onClose={handleAddChoreDialogClose}
        fetchMyChores={fetchMyChores}
      />
    </List>
  );
}

function Chore(props) {
  const classes = useStyles();
  const [chore, setChore] = useState(props.chore);
  const [isConfirmPaymentLoading, setIsConfirmPaymentLoading] = useState(false);

  useEffect(() => {
    setChore(props.chore);
  }, [props.chore]);

  const handleConfirmPayment = (timeCreated) => {
    setIsConfirmPaymentLoading(true);
    API.put(config.Amplify.API.endpoints[0].name, "/confirmChorePayment", {
      body: {
        timeCreated,
      },
    })
      .then((data) => {
        setIsConfirmPaymentLoading(false);
        if (data.message === "Payment confirmed") {
          const updatedChore = { ...chore, IsPaid: true };
          setChore(updatedChore);
        }
      })
      .catch((error) => {
        setIsConfirmPaymentLoading(false);
        console.log(error);
      });
  };

  return (
    <Paper className={classes.paper}>
      <Box className={classes.choreRow}>
        <Typography component="span">{`${chore.Chore} `}</Typography>
        <Typography variant="caption" color="textSecondary">
          {new Date(Number(chore.TimeCreated)).toDateString()}
        </Typography>
      </Box>

      <Box className={classes.choreRow}>
        <Typography component="span" className="cents">
          ${chore.Cents / 100}
        </Typography>
        <Typography
          className="is-confirmed"
          color={chore.IsConfirmed ? "primary" : "textSecondary"}
        >
          {chore.IsConfirmed
            ? chore.IsPaid
              ? "Paid"
              : "Not Paid"
            : "Not Confirmed"}
        </Typography>

        {/*
        {!chore.IsPaid && !chore.IsConfirmed ? (
          <Button variant="outlined" size="small">
            Edit
          </Button>
        ) : null}
        */}

        {!chore.IsPaid && chore.IsConfirmed ? (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleConfirmPayment(chore.TimeCreated)}
            disabled={isConfirmPaymentLoading}
          >
            {isConfirmPaymentLoading ? `Loading...` : `Confirm Payment`}
          </Button>
        ) : null}
      </Box>
    </Paper>
  );
}
