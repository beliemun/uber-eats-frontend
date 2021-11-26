import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurants } from "../../components/restaurants";
import { SearchBar } from "../../components/search-bar";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantFragment
      }
      category {
        ...CategoryFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

type ICategoryParams = {
  slug: string;
};

export const CategoryScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  const params = useParams() as ICategoryParams;
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          slug: params.slug,
          page,
        },
      },
    }
  );

  return (
    <div>
      <SearchBar />
      {!loading && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl text-gray-400 pt-5">{`Category: ${params.slug}`}</h2>
          {data && (
            <Restaurants
              title={"Recommended Retaurants"}
              restaurants={data.category.restaurants}
              totalPages={data.category.totalPages}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
};
