import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useMe } from "../../hooks/useMe";
import {
  CreateOrderItemInput,
  UserRole,
} from "../../__generated__/globalTypes";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";

export const RESTAURANT_QEURY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantFragment
        menu {
          ...DishFragment
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantScreen: React.FC = () => {
  const { data: userData } = useMe();
  const [isCustomer] = useState(userData?.me.role === UserRole.Client);
  const params = useParams() as IRestaurantParams;
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QEURY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const startOrder = () => {
    setOrderStarted(!orderStarted);
    setOrderItems([]);
  };
  const getItem = (dishId: number) =>
    orderItems.find((order) => order.dishId === dishId);
  // 주문 리스트에 음식이 현재 추가되어 있는지 확인
  const isSelected = (dishId: number) => Boolean(getItem(dishId));
  // 주문할 음식
  const addOrderItem = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((prev) => [{ dishId, options: [] }, ...prev]);
  };
  // 취소할 음식
  const removeOrderItem = (dishId: number) =>
    setOrderItems(orderItems.filter((item) => item.dishId !== dishId));
  // 추가로 선택할 수 있는 옵션이 있는 음식의 경우, 옵션을 추가

  useEffect(() => {
    console.log(orderItems);
  }, [orderItems]);
  return (
    <div>
      <div
        className="bg-gray-800 bg-cover bg-center py-40"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-4 pl-20">
          <h4 className="text-2xl mb-2">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-1">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        <div className="pb-10">
          <span
            onClick={startOrder}
            className="text-white bg-green-500 py-4 px-8 cursor-pointer"
          >
            {`${orderStarted ? "Ordering" : "Start Order"}`}
          </span>
        </div>
        {data?.restaurant.restaurant?.menu.length === 0 ? (
          <div className="text-sm text-gray-500">
            <h4>Menu not found</h4>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.restaurant.restaurant?.menu.map((dish) => (
              <Dish
                key={dish.id}
                dish={dish}
                orderStarted={orderStarted}
                isSelected={isSelected(dish.id)}
                addOrderItem={addOrderItem}
                removeOrderItem={removeOrderItem}
              >
                {/* 컴포넌트에 너무 많은 props를 전달하지 않기 위해서 children으로 렌더함 */}
                {/* isCustomer: role이 client 일때만 옵션이 보여야 하고 */}
                {/* dish.options: 주문에 옵션이 있어야만 옵션이 보여야 하고 */}
                {/* isSelected: 주문이 일단 담아져야 옵션을 볼 수 있다. */}
                {isCustomer && dish.options && isSelected(dish.id) && (
                  <div className="pt-2 ">
                    {dish.options.map((option, index) => (
                      <DishOption
                        key={index}
                        dishId={dish.id}
                        option={option}
                        getItem={getItem}
                        isSelected={isSelected}
                        setOrderItems={setOrderItems}
                        removeOrderItem={removeOrderItem}
                      />
                    ))}
                  </div>
                )}
              </Dish>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
