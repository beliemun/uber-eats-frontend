import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { SignInScreen } from "../sign-in";
import userEvent from "@testing-library/user-event";

describe("<SignInScreen />", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      const mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <HelmetProvider>
            <Router>
              <SignInScreen />
            </Router>
          </HelmetProvider>
        </ApolloProvider>
      );
    });
  });
  it("should render well", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Sign In | Uber Eats");
    });
  });
  it("display email validation error", async () => {
    const { getByPlaceholderText, debug, getByText } = renderResult;
    const email = getByPlaceholderText("Email");
    const password = getByPlaceholderText("Password");
    await waitFor(() => {
      userEvent.type(email, "test@test");
    });
    getByText("• It must be in email format.");
    await waitFor(() => {
      userEvent.type(password, "123");
    });
    debug();
    getByText("• Password should be longer than 4.");
  });
});

// TypeError: Cannot read properties of undefined (reading 'add') 에러 > Helmet 사용으로 나타나는 오류
// render 할때 state가 바뀌는 것에는 await를 해줘야 한다.
