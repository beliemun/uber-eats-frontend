import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  const onClink = () => {
    isLoggedInVar(false);
  };

  return (
    <>
      <h1>Logged In Screen</h1>
      <button onClick={onClink}>Click to logout</button>
    </>
  );
};
