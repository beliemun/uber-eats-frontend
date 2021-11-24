import React from "react";

interface IFormErrorProps {
  message: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ message }) => (
  <span className="text-rose-400">{`• ${message}`}</span>
);
