import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Helmet>
        <title>Page not found | Uber Eats</title>
      </Helmet>
      <h2 className="font-bold text-4xl text-rose-500 mb-5">Page not found</h2>
      <h4 className="text-sm font-medium mb-5">
        The page you're looking for does not exist or has moved.
      </h4>
      <Link to="/">
        <span className="text-sm text-rose-400 hover:underline ">
          Go back home &rarr;
        </span>
      </Link>
    </div>
  );
};
