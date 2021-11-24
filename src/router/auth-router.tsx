import React from "react";
import { gql, useQuery } from "@apollo/client";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";
import { me } from "../__generated__/me";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../routes/client/restaurants";
import { Loading } from "../components/loading";
import { NotFound } from "../routes/404";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

const ClientRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Restaurants />} />
    <Route path="/*" element={<NotFound />} />
  </Routes>
);

export const LoggedInRouter: React.FC = () => {
  const { data, loading } = useQuery<me>(ME_QUERY);

  const onClink = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    authToken("");
  };

  return loading ? (
    <Loading />
  ) : (
    <Router>
      {data?.me.role === UserRole.Client && <ClientRoutes />}
      <button onClick={onClink}>Click to logout</button>
    </Router>
  );
};
