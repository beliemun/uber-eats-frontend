import { render } from "@testing-library/react";
import { Loading } from "../loading";

describe("<Loading />", () => {
  it("should render well", () => {
    const { getByText } = render(<Loading />);
    getByText("Loading...");
  });
});
