import React from "react";
import { myRestaurant_myRestaurant_restaurant_menu } from "../__generated__/myRestaurant";

interface IDishProps {
  dish: myRestaurant_myRestaurant_restaurant_menu;
}

export const Dish: React.FC<IDishProps> = ({ dish }) => {
  return (
    <div className="border p-3 mt-4">
      <h4 className="text-lg font-medium text-green-500">{dish.name}</h4>
      <h5 className="text-sm mt-2">{dish.price}원</h5>
      <h5 className="text-sm text-gray-400">{dish.description}</h5>
    </div>
  );
};
