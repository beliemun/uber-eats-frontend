import { render, waitFor } from "../../test-utils";
import { isLoggedInVar } from "../../apollo";
import App from "../app";

jest.mock("../../routers/un-auth", () => {
  return {
    UnAuth: () => <span>Logged out</span>,
  };
});
jest.mock("../../routers/auth", () => {
  return {
    Auth: () => <span>Logged in</span>,
  };
});

describe("<App />", () => {
  //individual test
  it("render UnAuth", () => {
    const { getByText } = render(<App />);
    getByText("Logged out");
  });

  it("render Auth", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("Logged in");
  });
});
