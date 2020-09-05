import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import Amplify, { Auth } from "aws-amplify";
import config from "./config.js";

import App from "./App";

Amplify.configure({
  Auth: {
    region: config.Amplify.Auth.region,
    userPoolId: config.Amplify.Auth.userPoolId,
    userPoolWebClientId: config.Amplify.Auth.userPoolWebClientId,
  },
  API: {
    endpoints: [
      {
        name: config.Amplify.API.endpoints[0].name,
        endpoint: config.Amplify.API.endpoints[0].endpoint,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
