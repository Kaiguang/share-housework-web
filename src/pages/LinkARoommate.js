import React, { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import { navBarTitleState, userProfileState } from "../atoms.js";
import config from "../config.js";

const useStyles = makeStyles({
  formElements: {
    marginTop: "12px",
  },
});

export default function LinkARoommate() {
  const classes = useStyles();
  const [roommatesEmail, setRoommatesEmail] = useState("");
  const setNavBarTitle = useSetRecoilState(navBarTitleState);
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const history = useHistory();

  useEffect(() => {
    setNavBarTitle(`Link a roommate`);
  }, [setNavBarTitle]);

  const handleRequestButtonClick = () => {
    const updatedUserProfile = {
      ...userProfile,
      RequestingRoommate: { Username: roommatesEmail, Nickname: "" },
    };

    API.put(config.Amplify.API.endpoints[0].name, "/requestRoommate", {
      body: updatedUserProfile,
    })
      .then((result) => {
        setUserProfile(updatedUserProfile);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleRequestCancelButtonClick = () => {
    API.put(config.Amplify.API.endpoints[0].name, "/cancelRoommateRequest", {
      body: userProfile,
    })
      .then(() => {
        setUserProfile({
          ...userProfile,
          RequestingRoommate: { Username: "", Nickname: "" },
        });
      })
      .catch((error) => console.log(error));
  };

  const handleRoommateRequestAcceptButtonClick = () => {
    API.put(config.Amplify.API.endpoints[0].name, "/acceptRoommateRequest", {
      body: userProfile,
    })
      .then(() => API.get(config.Amplify.API.endpoints[0].name, "/getUserProfile"))
      .then((data) => {
        setUserProfile(data.Item);
        history.push("/PayeesChores");
      })
      .catch((error) => console.log(error));
  };

  const handleRoommatesEmailChange = (event) => {
    setRoommatesEmail(event.target.value);
  };

  if (
    userProfile.RequestingRoommate.Username === "" &&
    userProfile.RoommateRequestedBy.Username === ""
  ) {
    return (
      <Box>
        <TextField
          className={classes.formElements}
          fullWidth
          variant="outlined"
          label="Roommate's email"
          type="email"
          value={roommatesEmail}
          onChange={handleRoommatesEmailChange}
        />
        <Button
          className={classes.formElements}
          variant="outlined"
          fullWidth
          onClick={handleRequestButtonClick}
        >
          Send Request
        </Button>
      </Box>
    );
  } else if (
    userProfile.RequestingRoommate.Username !== "" &&
    userProfile.RoommateRequestedBy.Username === ""
  ) {
    return (
      <div>
        Waiting for {userProfile.RequestingRoommate.Username} to confirm
        <Button
          className={classes.formElements}
          variant="outlined"
          fullWidth
          onClick={handleRequestCancelButtonClick}
        >
          Cancel my request
        </Button>
      </div>
    );
  } else if (
    userProfile.RequestingRoommate.Username === "" &&
    userProfile.RoommateRequestedBy.Username !== ""
  ) {
    return (
      <div>
        {userProfile.RoommateRequestedBy.Username} would like to be your
        roommate
        <Button
          className={classes.formElements}
          variant="outlined"
          fullWidth
          onClick={handleRoommateRequestAcceptButtonClick}
        >
          Accept
        </Button>
      </div>
    );
  }

  return <div>Link a roommate</div>;
}
