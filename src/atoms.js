import { atom } from "recoil";

export const isSignedInState = atom({
  key: "isSignedInState",
  default: false,
});

export const navBarTitleState = atom({
  key: "navBarTitle",
  default: "",
});

export const userProfileState = atom({
  key: "userProfile",
  default: {
    Username: "",
    RequestingRoommate: { Username: "", Nickname: "" },
    RoommateRequestedBy: { Username: "" },
    CanConfirmWhom: { Username: "", Nickname: "" },
    CanPerformChores: [],
  },
});
