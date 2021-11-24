import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotFound } from "../routes/404";
import { SignInScreen } from "../routes/sign-in";
import { SignUpScreen } from "../routes/sign-up";

export const LoggedOutRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInScreen />} />
        <Route path="/sign-up" element={<SignUpScreen />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
