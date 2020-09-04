import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useHistory } from "react-router-dom";

import { signOut } from "../auth";
import { isSignedInState } from "../atoms";

function SignOut() {
  const history = useHistory();
  const setIsSignedIn = useSetRecoilState(isSignedInState);

  useEffect(() => {
    signOut()
      .then(() => {
        setIsSignedIn(false);
        history.push("/SignIn")
      })
      .catch((error) => console.log(error));
  });
  return <></>;
}

export default SignOut;
