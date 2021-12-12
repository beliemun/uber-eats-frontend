import React from "react";
import { myRestaurant_myRestaurant_restaurant_menu } from "../__generated__/myRestaurant";

interface IDishProps {
  dish: myRestaurant_myRestaurant_restaurant_menu;
  orderStarted?: boolean;
  isSelected?: boolean;
  addOrderItem?: (dishId: number) => void;
  removeOrderItem?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  dish,
  orderStarted = false,
  isSelected = false,
  addOrderItem = () => null,
  removeOrderItem = () => null,
  children: dishOptions,
}) => {
  const addOrderToList = () => {
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
            ? "border-green-400 bg-green-200"
            : "hover:bg-green-100 border-2"
          : ""
      }`}
    >
      <h4 className="text-lg font-medium text-gray-800">
        {dish.name}
        <span
          onClick={addOrderToList}
          className={`${
            orderStarted
              ? "text-sm pl-2 cursor-pointer text-green-500 font-medium hover:underline"
              : "hidden"
          }`}
        >
          주문 담기
        </span>
      </h4>
      <h5 className="text-sm mt-2">{dish.price}원</h5>
      <h5 className="text-sm text-gray-400">{dish.description}</h5>
      {/* isCustomer: role이 client 일때만 옵션이 보여야 하고 */}
      {/* dish.options: 주문에 옵션이 있어야만 옵션이 보여야 하고 */}
      {/* isSelected: 주문이 일단 담아져야 옵션을 볼 수 있다. */}
      {dishOptions}
    </div>
  );
};
