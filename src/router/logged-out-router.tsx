import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInScreen } from "../routes/sign-in";
import { SignUpScreen } from "../routes/sign-up";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInScreen />} />
        <Route path="/sign-up" element={<SignUpScreen />} />
      </Routes>
    </Router>
  );
};
