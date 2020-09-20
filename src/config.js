// for development environment
/*
export default {
  Amplify: {
    Auth: {
      region: "us-west-2",
      userPoolId: "us-west-2_REmVRjMZ7",
      userPoolWebClientId: "43tv1jhs43tnrd0uq1mn7quc1q",
    },
    API: {
      endpoints: [
        {
          name: "share-housework-dev",
          endpoint: "https://rqoej1ue9i.execute-api.us-west-2.amazonaws.com",
        },
      ],
    },
  },
};
*/

// for production environment
export default {
  Amplify: {
    Auth: {
      region: "us-west-2",
      userPoolId: "us-west-2_0YmopcueY",
      userPoolWebClientId: "1cg9ntd42js2tp192stroj9o1q",
    },
    API: {
      endpoints: [
        {
          name: "ShareHousework",
          endpoint: "https://wurwar3lj1.execute-api.us-west-2.amazonaws.com",
        },
      ],
    },
  },
};
