import { render } from "../../test-utils";
import { SearchBar } from "../search-bar";
import { BrowserRouter as Router } from "react-router-dom";

describe("<SearchBar />", () => {
  it("should render well", () => {
    const { getByPlaceholderText } = render(<SearchBar />);
    getByPlaceholderText("Search Restaurants...");
  });
});
