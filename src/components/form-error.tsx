import React from "react";

interface IFormErrorProps {
  message: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ message }) => (
  <span role="alert" className="text-rose-400">{`• ${message}`}</span>
);
