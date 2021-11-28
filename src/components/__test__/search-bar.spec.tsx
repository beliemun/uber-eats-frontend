import { render } from "@testing-library/react";
import { SearchBar } from "../search-bar";
import { BrowserRouter as Router } from "react-router-dom";

describe("<SearchBar />", () => {
  it("should render well", () => {
    render(
      <Router>
        <SearchBar />
      </Router>
    );
  });
});
