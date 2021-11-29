import { render } from "../../test-utils";
import {
  seeRetaurants_seeCategories,
  seeRetaurants_seeCategories_categories,
} from "../../__generated__/seeRetaurants";
import { Categories } from "../cotegories";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Categories />", () => {
  it("should render well with props", () => {
    const category: seeRetaurants_seeCategories_categories = {
      __typename: "Category",
      id: 1,
      name: "textCategory",
      coverImage: "http://",
      slug: "text-slug",
      restaurantCount: 1,
    };
    const categories: seeRetaurants_seeCategories = {
      __typename: "SeeCategoriesOutput",
      ok: true,
      error: null,
      categories: [category],
    };
    const { getByText } = render(<Categories seeCategories={categories} />);
    getByText(category.name);
  });
});
