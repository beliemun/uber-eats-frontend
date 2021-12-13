/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: pendingOrder
// ====================================================

export interface pendingOrder_pendingOrder_driver {
  __typename: "User";
  email: string;
}

export interface pendingOrder_pendingOrder_customer {
  __typename: "User";
  email: string;
}

export interface pendingOrder_pendingOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface pendingOrder_pendingOrder {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: pendingOrder_pendingOrder_driver | null;
  customer: pendingOrder_pendingOrder_customer | null;
  restaurant: pendingOrder_pendingOrder_restaurant | null;
}

export interface pendingOrder {
  pendingOrder: pendingOrder_pendingOrder;
}
