import { render, waitFor } from "@testing-library/react";
import { isLoggedInVar } from "../../apollo";
import App from "../app";

jest.mock("../../routers/unauth-router", () => {
  return {
    UnAuthRouter: () => <span>Logged out</span>,
  };
});
jest.mock("../../routers/auth-router", () => {
  return {
    AuthRouter: () => <span>Logged in</span>,
  };
});

describe("<App />", () => {
  //individual test
  it("render UnAuthRouter", () => {
    const { getByText } = render(<App />);
    getByText("Logged out");
  });

  it("render AuthRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("Logged in");
  });
});
