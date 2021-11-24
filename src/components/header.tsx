import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";
import { useMe } from "../hooks/useMe";
import uberLogo from "../images/uber-eats-logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();

  const onClink = () => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    authToken("");
  };

  return (
    <header className="py-4">
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={uberLogo} alt="logo" className="w-40" />
        </Link>
        <div className="text-sm">
          <span className="text-green-500 hover:underline">
            <FontAwesomeIcon icon={faUser} className="text-sm mr-1" />
            <Link to="/my-profile">{data?.me.email}</Link>
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
  );
};
