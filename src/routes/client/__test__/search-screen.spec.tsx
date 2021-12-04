import { MockedProvider } from "@apollo/client/testing";
import { waitFor } from "@testing-library/react";
import { render, RenderResult } from "../../../test-utils";
import { seeRetaurants_seeRestaurants_results } from "../../../__generated__/seeRetaurants";
import { SearchScreen, SEARCH_RESTAURANT } from "../search-screen";

describe("<SearchScreen />", () => {
  let renderResult: RenderResult;
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
                query: SEARCH_RESTAURANT,
                variables: {
                  input: {
                    page: 1,
                    term: "test-term",
                  },
                },
              },
              result: {
                data: {
                  searchRestaurant: {
                    ok: true,
                    error: "test-error",
                    totalPages: 1,
                    totalResults: 1,
                    restaurants: [restaurant],
                  },
                },
              },
            },
          ]}
        >
          <SearchScreen />
        </MockedProvider>
      );
    });
  });
  it("should render well", async () => {
    const {} = renderResult;
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
