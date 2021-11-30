import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test-utils";
import { UserRole } from "../../__generated__/globalTypes";
import { CREATE_ACCOUNT_MUTATION, SignUpScreen } from "../sign-up";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useNavigate: () => mockNavigate,
  };
});

describe("<SignUpScreen />", () => {
  let mockedClient = createMockClient();
  let rederResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      rederResult = render(
        <ApolloProvider client={mockedClient}>
          <SignUpScreen />
        </ApolloProvider>
      );
    });
  });

  it("should render well", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Sign Up | Uber Eats");
    });
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText, getByText, debug } = rederResult;
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const submitButton = getByRole("button");

    // email validation
    await waitFor(() => {
      userEvent.type(emailInput, "test@test");
    });
    getByText("• It must be in email format.");
    // await waitFor(() => {
    //   userEvent.clear(emailInput);
    // });
    // getByText("• Email is required.");

    // password validation
    await waitFor(() => {
      userEvent.type(passwordInput, "123");
    });
    getByText("• Password should be longer than 4.");
    // await waitFor(() => {
    //   userEvent.clear(passwordInput);
    // });
    // getByText("• Password is required.");
  });

  it("submits mutations with form values", async () => {
    const { getByRole, getByPlaceholderText, getByText, debug } = rederResult;
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const submitButton = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "test-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(emailInput, formData.email);
      userEvent.type(passwordInput, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      input: formData,
    });
    getByText("• test-error");
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(window.alert).toHaveBeenCalledWith("Account Created. Sign in now!");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
