import { render } from "../../test-utils";
import {
  seeRetaurants_seeRestaurants_results,
  seeRetaurants_seeRestaurants_results_category,
} from "../../__generated__/seeRetaurants";
import { Restaurants } from "../restaurants";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurants />", () => {
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
  const restaurantsProps = {
    title: "Restaurants",
    restaurants: [restaurant],
    totalPages: 1,
    page: 1,
    setPage: jest.fn(),
  };
  it("should render well", () => {
    render(<Restaurants {...restaurantsProps} />);
  });
  it("should render a prev button if page value is higher than 1.", () => {
    const { getByText } = render(
      <Restaurants {...restaurantsProps} page={2} />
    );
    getByText("←");
  });
  it("should render a next arrow if page is not equal with totalPages", () => {
    const { getByText } = render(
      <Restaurants {...restaurantsProps} page={1} totalPages={2} />
    );
    getByText("→");
  });
});
