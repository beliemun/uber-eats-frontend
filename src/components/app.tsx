import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { AuthRouter } from "../router/auth-router";
import { UnAuthRouter } from "../router/unauth-router";

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <AuthRouter /> : <UnAuthRouter />;
};

export default App;
