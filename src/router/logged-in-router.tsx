import React from "react";
import { gql, useQuery } from "@apollo/client";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";
import { me } from "../__generated__/me";

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

export const LoggedInRouter: React.FC = () => {
  const { data, loading, error } = useQuery<me>(ME_QUERY);

  const onClink = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    authToken("");
  };

  return loading ? (
    <div className="h-screen flex justify-center items-center">
      <span className="text-sm font-medium tracking-widest text-rose-400">
        Loading...
      </span>
    </div>
  ) : (
    <>
      <h1>{data?.me.email}</h1>
      <button onClick={onClink}>Click to logout</button>
    </>
  );
};
