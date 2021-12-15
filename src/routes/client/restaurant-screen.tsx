import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useMe } from "../../hooks/useMe";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated__/createOrder";
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
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantScreen: React.FC = () => {
  const navigate = useNavigate();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      navigate(`/orders/${orderId}`);
    }
  };
  const [createOrder, { loading }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const onSubmit = () => {
    if (loading) {
      return;
    }
    createOrder({
      variables: {
        input: {
          restaurantId: +params.id,
          items: orderItems,
        },
      },
    });
  };
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
  const isSelected = (dishId: number) => Boolean(getItem(dishId));
  const addOrderItem = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((prev) => [{ dishId, options: [] }, ...prev]);
  };
  const removeOrderItem = (dishId: number) =>
    setOrderItems(orderItems.filter((item) => item.dishId !== dishId));
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
          {orderStarted ? (
            <>
              <span
                onClick={onSubmit}
                className="text-white bg-rose-500 py-4 px-8 cursor-pointer"
              >
                Finish
              </span>
              <span
                onClick={startOrder}
                className="text-rose-500 py-4 px-8 cursor-pointer"
              >
                Cancel
              </span>
            </>
          ) : (
            <span
              onClick={startOrder}
              className="text-white bg-green-500 py-4 px-8 cursor-pointer"
            >
              Start Order
            </span>
          )}
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
