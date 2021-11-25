import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  seeRetaurants,
  seeRetaurantsVariables,
} from "../../__generated__/seeRetaurants";
import { couldStartTrivia } from "typescript";

const SEE_RESTAURANT_QUERY = gql`
  query seeRetaurants($input: SeeRestaurantsInput!) {
    seeCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    seeRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants: React.FC = () => {
  const { data, loading } = useQuery<seeRetaurants, seeRetaurantsVariables>(
    SEE_RESTAURANT_QUERY,
    { variables: { input: { page: 1 } } }
  );

  return (
    <div>
      <form className="bg-gray-800 w-full py-28 flex justify-center items-center">
        <input
          className="input w-5/12 rounded-md"
          type="search"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="flex p-4 mx-auto ">
          {data?.seeCategories.categories?.map((category, index) => (
            <div key={index} className="flex-center flex-col mr-4">
              <div
                className="w-16 h-16 bg-cover rounded-full border-4 border-gray-200 hover:border-green-500 cursor-pointer"
                style={{ backgroundImage: `url(${category.coverImage})` }}
              />
              <span className="text-sm mt-2">{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
