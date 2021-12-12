import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { getOrder, getOrderVariables } from "../../__generated__/getOrder";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

interface IParams {
  id: string;
}

export const Order: React.FC = () => {
  const params = useParams() as IParams;
  const { data } = useQuery<getOrder, getOrderVariables>(GET_ORDER_QUERY, {
    variables: {
      input: { id: +params.id },
    },
  });
  console.log(data);
  return <h1>{params.id}</h1>;
};
