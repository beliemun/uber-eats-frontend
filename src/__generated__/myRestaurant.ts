/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myRestaurant
// ====================================================

export interface myRestaurant_myRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurant_myRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: myRestaurant_myRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface myRestaurant_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurants: myRestaurant_myRestaurant_restaurants[];
}

export interface myRestaurant {
  myRestaurant: myRestaurant_myRestaurant;
}
