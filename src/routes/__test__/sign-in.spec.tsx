import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { LOGIN_MUTATION, SignInScreen } from "../sign-in";
import { render, waitFor, RenderResult } from "../../test-utils";
import userEvent from "@testing-library/user-event";

describe("<SignInScreen />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  const formData = {
    email: "test@test.com",
    password: "1234",
  };
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <SignInScreen />
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
    const { getByPlaceholderText, getByText } = renderResult;
    const emailInput = getByPlaceholderText("Email");
    await waitFor(() => {
      userEvent.type(emailInput, "test@test");
    });
    getByText("• It must be in email format.");
  });

  it("submit form and calls mutation", async () => {
    const { getByPlaceholderText, getByText } = renderResult;
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const submitButton = getByText("Sign in");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: "test-error",
          token: "test-token",
        },
      },
    });

    jest.spyOn(Storage.prototype, "setItem");
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(emailInput, formData.email);
      userEvent.type(passwordInput, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({ input: formData });
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
    getByText("• test-error");
  });
});

// TypeError: Cannot read properties of undefined (reading 'add') 에러 > Helmet 사용으로 나타나는 오류
// render 할때 state가 바뀌는 것에는 await를 해줘야 한다.
