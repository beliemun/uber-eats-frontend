import React from "react";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";

export const LoggedInRouter = () => {
  const onClink = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    authToken("");
  };

  return (
    <>
      <h1>Logged In Screen</h1>
      <button onClick={onClink}>Click to logout</button>
    </>
  );
};
