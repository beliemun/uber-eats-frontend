/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: FullOrderFragment
// ====================================================

export interface FullOrderFragment_driver {
  __typename: "User";
  email: string;
}

export interface FullOrderFragment_customer {
  __typename: "User";
  email: string;
}

export interface FullOrderFragment_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface FullOrderFragment {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: FullOrderFragment_driver | null;
  customer: FullOrderFragment_customer | null;
  restaurant: FullOrderFragment_restaurant | null;
}
