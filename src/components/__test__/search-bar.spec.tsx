import { render } from "@testing-library/react";
import { SearchBar } from "../search-bar";
import { BrowserRouter as Router } from "react-router-dom";

describe("<SearchBar />", () => {
  it("should render well", () => {
    const { getByPlaceholderText } = render(
      <Router>
        <SearchBar />
      </Router>
    );
    getByPlaceholderText("Search Restaurants...");
  });
});
