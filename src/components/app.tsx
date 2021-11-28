import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { AuthRouter } from "../routers/auth-router";
import { UnAuthRouter } from "../routers/unauth-router";

export const App: React.FC = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <AuthRouter /> : <UnAuthRouter />;
};

export default App;
