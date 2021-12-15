import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { useMe } from "../../hooks/useMe";
import { editOrder, editOrderVariables } from "../../__generated__/editOrder";
import { getOrder, getOrderVariables } from "../../__generated__/getOrder";
import { OrderStatus, UserRole } from "../../__generated__/globalTypes";
import { orderUpdates } from "../../__generated__/orderUpdates";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderFragment
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderFragment
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order: React.FC = () => {
  const [editOrderMutation, { loading: editOrderMutationLoading }] =
    useMutation<editOrder, editOrderVariables>(EDIT_ORDER_MUTATION);
  const { data: userData } = useMe();
  const params = useParams() as IParams;
  const { data, loading, subscribeToMore } = useQuery<
    getOrder,
    getOrderVariables
  >(GET_ORDER_QUERY, {
    variables: {
      input: { id: +params.id },
    },
  });
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: { input: { id: +params.id } },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          // query 빋은 data와 같은 형태로 리턴해야한다.
          return {
            getOrder: {
              ...prev.getOrder, // ok, error 가 있는 영역
              order: {
                ...data.orderUpdates, // 업데이트 받은 order
              },
            },
          };
        },
      });
    }
  }, [data, params.id, subscribeToMore]);
  // const { data: subscriptionData } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, { variables: { input: { id: +params.id } } });
  const onChangeOrderState = (status: OrderStatus) => {
    if (editOrderMutationLoading) {
      return;
    }
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status,
        },
      },
    });
  };
  // useEffect(() => {
  //   console.log("subscriptionData:");
  //   console.log(subscriptionData);
  // }, [subscriptionData]);
  return !loading || !data ? (
    <div className="flex justify-center pt-20">
      <Helmet>
        <title>Order #{params.id} | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-md border border-green-500">
        <h2 className="bg-green-500 font-medium text-white text-center text-xl py-4">
          Order #{data?.getOrder.order?.id}
        </h2>
        <div className="px-4">
          <h3 className="text-center text-2xl font-bold text-green-500 py-6">
            {data?.getOrder.order?.total}원
          </h3>
          <h4 className="py-4 border-t border-gray-200">
            Prepared By:{" "}
            <span className="font-bold">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </h4>
          <h4 className="py-4 border-t border-gray-200">
            Deliver To:{" "}
            <span className="font-bold">
              {data?.getOrder.order?.customer?.email}
            </span>
          </h4>
          <h4 className="py-4 border-t border-b border-gray-200">
            Driver:{" "}
            <span className="font-bold">
              {data?.getOrder.order?.driver
                ? data?.getOrder.order?.driver.email
                : "Not yet"}
            </span>
          </h4>
          {userData?.me.role === UserRole.Client && (
            <h3 className="py-4 text-center text-xl text-rose-500">
              {`Status: ${data?.getOrder.order?.status}`}
            </h3>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onChangeOrderState(OrderStatus.Cooking)}
                  className="button w-full my-4"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onChangeOrderState(OrderStatus.Cooked)}
                  className="button w-full my-4"
                >
                  Call Driver
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Pending &&
                data?.getOrder.order?.status !== OrderStatus.Cooking && (
                  <h3 className="py-4 text-center text-xl text-rose-500">
                    {`Status: ${data?.getOrder.order?.status}`}
                  </h3>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onChangeOrderState(OrderStatus.Delivered)}
                  className="button w-full my-4"
                >
                  Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <h3 className="py-4 text-center text-xl text-green-500">
              {`Thank you for using Uber eats!`}
            </h3>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
