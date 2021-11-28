import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";

const RESTAURANT_QEURY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
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
      <div className="max-w-4xl mx-auto"></div>
    </div>
  );
};
