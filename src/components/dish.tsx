import React, { useState } from "react";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";
import { myRestaurant_myRestaurant_restaurant_menu } from "../__generated__/myRestaurant";

interface IDishProps {
  dish: myRestaurant_myRestaurant_restaurant_menu;
  orderStarted?: boolean;
  isSelected?: boolean;
  addOrderItem?: (dishId: number) => void;
  removeOrderItem?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  dish,
  orderStarted = false,
  isSelected = false,
  addOrderItem = () => null,
  removeOrderItem = () => null,
}) => {
  const { data: userData } = useMe();
  const [isCustomer] = useState(userData?.me.role === UserRole.Client);
  const onClick = () => {
    if (orderStarted) {
      if (isSelected) {
        removeOrderItem(dish.id);
      } else {
        addOrderItem(dish.id);
      }
    }
  };
  return (
    <div
      className={`border p-3 mt-4 ${
        orderStarted
          ? isSelected
            ? "cursor-pointer border-green-400 bg-green-200"
            : "cursor-pointer hover:bg-green-100 border-2"
          : ""
      }`}
      onClick={onClick}
    >
      <h4 className="text-lg font-medium text-green-500">{dish.name}</h4>
      <h5 className="text-sm mt-2">{dish.price}원</h5>
      <h5 className="text-sm text-gray-400">{dish.description}</h5>
      {isCustomer && dish.options && (
        <div className="pt-2 ">
          {dish.options.map((option, index) => (
            <span
              key={index}
              className="text-sm font-medium text-green-500 pr-2 cursor-pointer hover:underline"
            >
              {`${option.name}(+${option.extra}원)`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
