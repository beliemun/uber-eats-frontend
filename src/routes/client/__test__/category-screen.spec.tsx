import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "../../../test-utils";
import {
  seeRetaurants_seeCategories_categories,
  seeRetaurants_seeRestaurants_results,
} from "../../../__generated__/seeRetaurants";
import { CategoryScreen, CATEGORY_QUERY } from "../category-screen";

describe("<CategoryScreen />", () => {
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
    await waitFor(() => {
      renderResult = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CATEGORY_QUERY,
                variables: {
                  input: {
                    slug: undefined,
                    page: 1,
                  },
                },
              },
              result: {
                data: {
                  category: {
                    ok: true,
                    error: "test-error",
                    totalPages: 1,
                    totalResults: 1,
                    restaurants: [restaurant],
                    category,
                  },
                },
              },
            },
          ]}
        >
          <CategoryScreen />
        </MockedProvider>
      );
    });
  });

  it("should render well", async () => {
    const { getByText } = renderResult;
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    getByText("Recommended Retaurants");
    getByText("testRestaurant");
    getByText("testCategory");
  });
});
