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
import { MyRestaurants } from "../routes/owner/my-restaurants";
import { AddRestaurant } from "../routes/owner/add-restaurant";
import { MyRestaurant } from "../routes/owner/my-restaurant";
import { AddDish } from "../routes/owner/add-dish";
import { Order } from "../routes/user/order";
import { Dashboard } from "../routes/driver/dashboard";

const renderCommonRoutes = () => (
  <>
    <Route path="/confirm" element={<ConfirmEmail />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="/orders/:id" element={<Order />} />
    <Route path="/*" element={<NotFound />} />
  </>
);

const renderClientRoutes = () => (
  <>
    <Route path="/" element={<HomeScreen />} />
    <Route path="/search" element={<SearchScreen />} />
    <Route path="/category/:slug" element={<CategoryScreen />} />
    <Route path="/restaurant/:id" element={<RestaurantScreen />} />
  </>
);

const renderOwnerRoutes = () => (
  <>
    <Route path="/" element={<MyRestaurants />} />
    <Route path="/add-restaurant" element={<AddRestaurant />} />
    <Route path="/restaurant/:id" element={<MyRestaurant />} />
    <Route path="/restaurant/:id/add-dish" element={<AddDish />} />
  </>
);

const renderDriverRoutes = () => (
  <>
    <Route path="/" element={<Dashboard />} />
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
        {renderCommonRoutes()}
        {data?.me.role === UserRole.Client && renderClientRoutes()}
        {data?.me.role === UserRole.Owner && renderOwnerRoutes()}
        {data?.me.role === UserRole.Delivery && renderDriverRoutes()}
      </Routes>
    </>
  );
};
