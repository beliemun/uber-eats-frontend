import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  seeRetaurants,
  seeRetaurantsVariables,
} from "../../__generated__/seeRetaurants";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Restaurants } from "../../components/restaurants";
import { Categories } from "../../components/cotegories";
import { SearchBar } from "../../components/search-bar";

export const SEE_RESTAURANT_QUERY = gql`
  query seeRetaurants($input: SeeRestaurantsInput!) {
    seeCategories {
      ok
      error
      categories {
        ...CategoryFragment
      }
    }
    seeRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const HomeScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<seeRetaurants, seeRetaurantsVariables>(
    SEE_RESTAURANT_QUERY,
    {
      variables: { input: { page } },
    }
  );
  return (
    <div>
      <SearchBar />
      {!loading && data && (
        <div className="max-w-4xl mx-auto">
          <Categories seeCategories={data.seeCategories} />
          <Restaurants
            title={"Recommended Retaurants"}
            restaurants={data.seeRestaurants.results}
            totalPages={data.seeRestaurants.totalPages}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};
