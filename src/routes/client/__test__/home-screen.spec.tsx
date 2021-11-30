import { MockedProvider } from "@apollo/client/testing";
import { RenderResult, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import {
  seeRetaurants_seeCategories_categories,
  seeRetaurants_seeRestaurants_results,
} from "../../../__generated__/seeRetaurants";
import { HomeScreen, SEE_RESTAURANT_QUERY } from "../home-screen";

describe("<HomeScreen />", () => {
  let renderResult: RenderResult;
  const category: seeRetaurants_seeCategories_categories = {
    __typename: "Category",
    id: 1,
    name: "testCategory",
    coverImage: "http://",
    slug: "test-category-slug",
    restaurantCount: 1,
  };
  const restaurant: seeRetaurants_seeRestaurants_results = {
    __typename: "Restaurant",
    id: 1,
    address: "testAddress",
    category: {
      __typename: "Category",
      name: "testCategory",
    },
    coverImage: "testCoverImage",
    isPromoted: false,
    name: "testRestaurant",
  };

  beforeEach(async () => {
    renderResult = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: SEE_RESTAURANT_QUERY,
              variables: {
                input: {
                  page: 1,
                },
              },
            },
            result: {
              data: {
                seeCategories: {
                  ok: true,
                  error: "test-error",
                  categories: [category],
                },
                seeRestaurants: {
                  ok: true,
                  error: "test-error",
                  totalPages: 1,
                  totalResults: 1,
                  results: [restaurant],
                },
              },
            },
          },
        ]}
      >
        <HomeScreen />
      </MockedProvider>
    );
  });

  it("should render well", async () => {
    const { getByText } = renderResult;
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    getByText("testRestaurant");
  });
});
