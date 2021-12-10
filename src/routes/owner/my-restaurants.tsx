import { gql, useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurants } from "../../__generated__/myRestaurants";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
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
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <Helmet>
        <title>My Restaurants| Uber Eats</title>
      </Helmet>
      <h2 className="font-bold text-4xl text-green-400 mb-5">My Restaurants</h2>
      {data?.myRestaurants.restaurants.length === 0 ? (
        <h4 className="text-sm font-medium mb-5">You have no restaurants.</h4>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data?.myRestaurants.restaurants?.map((restaurant) => (
            <Restaurant restaurant={restaurant} key={restaurant.id} />
          ))}
        </div>
      )}
      <Link to="/add-restaurant">
        <span className="text-sm text-green-400 hover:underline ">
          Create a restaurant &rarr;
        </span>
      </Link>
    </div>
  );
};
