import React from "react";
import { Routes, Route } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";
import { HomeScreen } from "../routes/client/home-screen";
import { SearchScreen } from "../routes/client/search-screen";
import { CategoryScreen } from "../routes/client/category-screen";
import { ConfirmEmail } from "../routes/user/confirm-email";
import { EditProfile } from "../routes/user/edit-profile";
import { NotFound } from "../routes/404";
import { Loading } from "../components/loading";
import { Header } from "../components/header";
import { RestaurantScreen } from "../routes/client/restaurant-screen";

const renderClientRoutes = () => (
  <>
    <Route path="/" element={<HomeScreen />} />
    <Route path="/confirm" element={<ConfirmEmail />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="/search" element={<SearchScreen />} />
    <Route path="/category/:slug" element={<CategoryScreen />} />
    <Route path="/restaurant/:id" element={<RestaurantScreen />} />
    <Route path="/*" element={<NotFound />} />
  </>
);

export const Auth: React.FC = () => {
  const { data, loading, error } = useMe();

  return !data || loading || error ? (
    <Loading />
  ) : (
    <>
      {/* Header 안에서 Link를 사용할 것이고 Link는 반드시 Router안 위치해야 한다. */}
      <Header />
      <Routes>
        {data?.me.role === UserRole.Client && renderClientRoutes()}
      </Routes>
    </>
  );
};