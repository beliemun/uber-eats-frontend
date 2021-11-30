import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test-utils";
import { SearchBar } from "../search-bar";

describe("<SearchBar />", () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(<SearchBar />);
  });

  it("should render well", () => {
    const { getByPlaceholderText } = renderResult;
    getByPlaceholderText("Search Restaurants...");
  });

  it("should navaite to the serach route.", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const searchInput = getByPlaceholderText("Search Restaurants...");
    await waitFor(() => {
      userEvent.type(searchInput, "test-term");
      userEvent.type(searchInput, "{enter}");
    });
    // navigate까지 검사할 필요 없고 submit이 어떤 값으로 보내어졌는지 테스트해도 됨.
    expect(searchInput).toHaveValue("test-term");
  });
});
