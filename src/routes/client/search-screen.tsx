import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { gql, useLazyQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const SearchScreen: React.FC = () => {
  const onCompleted = (data: searchRestaurant) => {
    console.log(data);
  };
  const [searchQuery] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT, { onCompleted });

  const navigate = useNavigate();
  const location = useLocation();
  const term = location.search.split("?term=")[1];
  useEffect(() => {
    if (!term || term === "") {
      // 검색어가 없을 경우 /search route는 단독으로 사용될 수 없도록 replace로 navigate한다.
      navigate("/", { replace: true });
    }
    searchQuery({
      variables: {
        input: {
          term,
          page: 1,
        },
      },
    });
  }, [navigate, searchQuery, term]);

  return (
    <div>
      <Helmet>
        <title>{`Searching by ${term} | Uber Eats`}</title>
      </Helmet>
      <h1>{`Searching by ${term}`}</h1>
    </div>
  );
};
