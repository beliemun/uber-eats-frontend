import React from "react";
import { Link } from "react-router-dom";
import { seeRetaurants_seeRestaurants_results } from "../__generated__/seeRetaurants";

interface IRestaurantProps {
  restaurant: seeRetaurants_seeRestaurants_results;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="w-full mb-3">
        <div
          className="py-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        ></div>
        <h3 className="my-2 text-sm">{restaurant.name}</h3>
        <h4 className="text-xs text-gray-500 border-t border-gray-200 pt-2">
          {restaurant.category?.name}
        </h4>
      </div>
    </Link>
  );
};
