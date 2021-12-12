import React from "react";
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from "../__generated__/globalTypes";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishOptionProps {
  dishId: number;
  option: restaurant_restaurant_restaurant_menu_options;
  getItem: (dishId: number) => CreateOrderItemInput | undefined;
  isSelected: (dishId: number) => boolean;
  setOrderItems: React.Dispatch<React.SetStateAction<CreateOrderItemInput[]>>;
  removeOrderItem: (dishId: number) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  option,
  getItem,
  isSelected,
  setOrderItems,
  removeOrderItem,
}) => {
  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) =>
    Boolean(item.options?.find((option) => option.name === optionName));
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    return item ? getOptionFromItem(item, optionName) : false;
  };
  const addOptionToItem = (
    dishId: number,
    option: OrderItemOptionInputType
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    // 이전 주문을 기억했다가
    const oldItem = getItem(dishId);
    if (oldItem) {
      // 기존 선택된 옵션이 있는지 확인 (같은 옵션을 여러개 추가하지 못하도록 정책 설정)
      const hasOption = Boolean(
        oldItem.options?.find((curOption) => curOption.name === option.name)
      );
      if (!hasOption) {
        // 기존 주문을 지우고
        removeOrderItem(dishId);
        // 새로운 옵션을 추가하여 새로운 주문으로 추가
        setOrderItems((prev) => [
          { dishId, options: [option, ...oldItem.options!] },
          ...prev,
        ]);
      } else {
        window.alert("같은 옵션이 이미 추가되어 있습니다.");
      }
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const options = oldItem.options?.filter(
        (option) => option.name !== optionName
      );
      removeOrderItem(dishId);
      setOrderItems((prev) => [{ dishId, options }, ...prev]);
    }
  };
  return (
    <span
      onClick={() =>
        isOptionSelected(dishId, option.name)
          ? removeOptionFromItem(dishId, option.name)
          : addOptionToItem(dishId, option)
      }
      className={`text-sm font-medium cursor-pointer hover:underline pr-2 ${
        isOptionSelected(dishId, option.name)
          ? "text-rose-500"
          : "text-green-500"
      }`}
    >
      {`${option.name}(+${option.extra}원)`}
    </span>
  );
};
