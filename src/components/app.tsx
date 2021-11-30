import React from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { Auth } from "../routers/auth";
import { UnAuth } from "../routers/un-auth";

export const App: React.FC = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <Auth /> : <UnAuth />;
};

export default App;
