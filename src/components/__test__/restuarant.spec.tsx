import { render } from "@testing-library/react";
import {
  seeRetaurants_seeRestaurants_results,
  seeRetaurants_seeRestaurants_results_category,
} from "../../__generated__/seeRetaurants";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  const category: seeRetaurants_seeRestaurants_results_category = {
    __typename: "Category",
    name: "testCategory",
  };
  const restaurant: seeRetaurants_seeRestaurants_results = {
    __typename: "Restaurant",
    id: 1,
    address: "testAddress",
    category,
    coverImage: "testCoverImage",
    isPromoted: false,
    name: "testRestaurant",
  };

  it("render with props", () => {
    const { getByText, container } = render(
      <Router>
        <Restaurant restaurant={restaurant} />
      </Router>
    );
    getByText("testRestaurant");
    getByText("testCategory");
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${restaurant.id}`
    );
  });
});
