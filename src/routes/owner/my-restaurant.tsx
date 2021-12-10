import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
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

interface IParams {
  id: string;
}

export const MyRestaurant: React.FC = () => {
  const { id } = useParams() as IParams;
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: { input: { id: +id } },
    }
  );
  return (
    <div>
      <div
        className="bg-gray-800 bg-cover bg-center py-12"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-4 pl-20">
          <h4 className="text-2xl mb-2">
            {data?.myRestaurant.restaurant?.name}
          </h4>
          <h5 className="text-sm font-light mb-1">
            {data?.myRestaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.myRestaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex-col py-10">
          <Link
            to={`add-dish`}
            className="text-white bg-gray-800 py-4 px-8 mr-8"
          >
            Add Dish &rarr;
          </Link>
          <Link to={"#"} className="text-white bg-rose-500 py-4 px-8">
            Buy Promotion &rarr;
          </Link>
        </div>
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <div className="text font-bold text-rose-500">
            <h4>Please upload a dish!</h4>
          </div>
        ) : (
          <>
            {data?.myRestaurant.restaurant?.menu.map((dish) => (
              <h1>{dish.name}</h1>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
