import Amplify, { Auth } from "aws-amplify";
import config from "./config.js";

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

export function checkIfSession() {
  return Auth.currentSession();
}

export function signOut() {
  return Auth.signOut();
}

export async function signIn(username, password) {
  return Auth.signIn(username, password);
}

/*
export function forgotPassword() {
  Auth.forgotPassword("leavelux@icloud.com")
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}
*/
