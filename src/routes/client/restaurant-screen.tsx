import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
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
  const addOrderItem = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: null }, ...current]);
  };
  const removeOrderItem = (dishId: number) => {
    setOrderItems(orderItems.filter((item) => item.dishId !== dishId));
  };
  const isSelected = (dishId: number) => {
    return Boolean(orderItems.find((order) => order.dishId === dishId));
  };
  console.log(orderItems);
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
                addOrderItem={addOrderItem}
                removeOrderItem={removeOrderItem}
                isSelected={isSelected(dish.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
