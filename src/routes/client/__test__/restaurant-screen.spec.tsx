import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor, RenderResult } from "../../../test-utils";
import { seeRetaurants_seeRestaurants_results } from "../../../__generated__/seeRetaurants";
import { RestaurantScreen, RESTAURANT_QEURY } from "../restaurant-screen";

describe("<RestaurantScreen />", () => {
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
                query: RESTAURANT_QEURY,
                variables: {
                  input: {
                    restaurantId: 1,
                  },
                },
              },
              result: {
                data: {
                  restaurant: {
                    ok: true,
                    error: "test-error",
                    restaurant,
                  },
                },
              },
            },
          ]}
        >
          <RestaurantScreen />
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
