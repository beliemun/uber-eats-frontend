import { render } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render with props", () => {
    const { getByText } = render(
      <Button text="Test" canClick={true} loading={false} />
    );
    getByText("Test");
  });

  it("should render loading", () => {
    const { getByText } = render(
      <Button text="Test" canClick={true} loading={true} />
    );
    getByText("Loading...");
  });

  it("should render disabled button style", () => {
    const { container } = render(
      <Button text="Test" canClick={false} loading={true} />
    );
    expect(container.firstChild).toHaveClass("bg-gray-300 hover:bg-gray-300");
  });
});
