import React, { useEffect } from "react";
import { useLocation } from "react-router";

export const Search: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const term = location.search.split("?term=")[1];
    console.log(term);
  }, [location]);
  return (
    <div>
      <h1>Search Screen</h1>
    </div>
  );
};
