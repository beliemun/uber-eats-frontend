import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../routes/client/restaurants";
import { Loading } from "../components/loading";
import { NotFound } from "../routes/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../routes/user/confirm-email";
import { EditProfile } from "../routes/user/edit-profile";

const renderClientRoutes = () => (
  <>
    <Route path="/" element={<Restaurants />} />
    <Route path="/confirm" element={<ConfirmEmail />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="/*" element={<NotFound />} />
  </>
);

export const LoggedInRouter: React.FC = () => {
  const { data, loading, error } = useMe();

  return !data || loading || error ? (
    <Loading />
  ) : (
    <Router>
      {/* Header 안에서 Link를 사용할 것이고 Link는 반드시 Router안 위치해야 한다. */}
      <Header />
      <Routes>
        {data?.me.role === UserRole.Client && renderClientRoutes()}
      </Routes>
    </Router>
  );
};
