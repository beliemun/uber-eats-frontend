import { useApolloClient } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";
import { useMe } from "../hooks/useMe";
import uberLogo from "../images/uber-eats-logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  const { cache } = useApolloClient();
  const navigate = useNavigate();

  const onClink = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    authToken("");
    cache.evict({ id: "ROOT_QUERY", fieldName: "me" });
    navigate("/");
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-rose-500 text-sm text-center text-white font-medium p-2">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="p-4">
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={uberLogo} alt="logo" className="w-28 sm:w-40" />
          </Link>
          <div className="text-sm">
            <span className="text-green-500 hover:underline">
              <Link to="/edit-profile">
                <FontAwesomeIcon icon={faUser} className="text-sm mr-1" />
                <span className="hidden sm:inline">{data?.me.email}</span>
              </Link>
            </span>
            <span className="text-gray-300"> | </span>
            <button
              className="hover:text-green-400 hover:underline"
              onClick={onClink}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
