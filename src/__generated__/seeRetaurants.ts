/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeeRestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: seeRetaurants
// ====================================================

export interface seeRetaurants_seeCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface seeRetaurants_seeCategories {
  __typename: "SeeCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: seeRetaurants_seeCategories_categories[] | null;
}

export interface seeRetaurants_seeRestaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface seeRetaurants_seeRestaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: seeRetaurants_seeRestaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface seeRetaurants_seeRestaurants {
  __typename: "SeeRestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: seeRetaurants_seeRestaurants_results[] | null;
}

export interface seeRetaurants {
  seeCategories: seeRetaurants_seeCategories;
  seeRestaurants: seeRetaurants_seeRestaurants;
}

export interface seeRetaurantsVariables {
  input: SeeRestaurantsInput;
}
