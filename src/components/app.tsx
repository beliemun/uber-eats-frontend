import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { LoggedInRouter } from "../router/auth-router";
import { LoggedOutRouter } from "../router/unauth-router";

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};

export default App;
