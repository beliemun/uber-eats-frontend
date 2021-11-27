import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("should render with props", () => {
    const { debug, getByText } = render(<FormError message="test" />);
    getByText("• test");
  });
});
