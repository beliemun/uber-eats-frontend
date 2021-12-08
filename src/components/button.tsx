import React from "react";

interface IButtonProps {
  text: string;
  canClick: boolean;
  loading: boolean;
}

export const Button: React.FC<IButtonProps> = ({ text, canClick, loading }) => (
  <button
    className={`button mt-3 ${canClick ? "" : "bg-gray-300 hover:bg-gray-300"}`}
    disabled={!canClick}
  >
    {loading && "Loading..."}
    {!loading && text}
  </button>
);
