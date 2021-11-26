import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
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

export const Category: React.FC = () => {
  const params = useParams() as ICategoryParams;
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          slug: params.slug,
          page: 1,
        },
      },
    }
  );

  return (
    <div>
      <h1>Category</h1>
    </div>
  );
};
