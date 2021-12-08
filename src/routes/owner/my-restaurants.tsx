import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurant } from "../../__generated__/myRestaurant";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant {
    myRestaurant {
      ok
      error
      restaurants {
        ...RestaurantFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurant: React.FC = () => {
  const { data } = useQuery<myRestaurant>(MY_RESTAURANT_QUERY);
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <Helmet>
        <title>My Restaurants| Uber Eats</title>
      </Helmet>
      {data?.myRestaurant.restaurants.length === 0 && (
        <>
          <h2 className="font-bold text-4xl text-green-400 mb-5">
            My Restaurants
          </h2>
          <h4 className="text-sm font-medium mb-5">You have no restaurants.</h4>
          <Link to="/add-restaurant">
            <span className="text-sm text-green-400 hover:underline ">
              Create a restaurant &rarr;
            </span>
          </Link>
        </>
      )}
    </div>
  );
};
