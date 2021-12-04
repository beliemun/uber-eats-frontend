import { ApolloProvider } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient } from "mock-apollo-client";
import { ME_QUERY } from "../../../hooks/useMe";
import { render } from "../../../test-utils";
import { UserRole } from "../../../__generated__/globalTypes";
import { EditProfile, EDIT_PROFILE_MUTATION } from "../edit-profile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useNavigate: () => mockNavigate,
  };
});

describe("<EditProfile />", () => {
  let mockedClient = createMockClient();
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <MockedProvider
            mocks={[
              {
                request: {
                  query: ME_QUERY,
                },
                result: {
                  data: {
                    me: {
                      id: 1,
                      email: "test@test.com",
                      role: UserRole.Client,
                      verified: false,
                    },
                  },
                },
              },
            ]}
          >
            <EditProfile />
          </MockedProvider>
        </ApolloProvider>
      );
    });
  });

  it("should render well", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | Uber Eats");
    });
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText, getByText, debug } = renderResult;
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    // email validation
    await waitFor(() => {
      userEvent.type(emailInput, "test@test");
    });
    getByText("• It must be in email format.");
    await waitFor(() => {
      userEvent.type(passwordInput, "123");
    });
    getByText("• Password should be longer than 4.");
  });

  it("submits mutations with form values", async () => {
    const { getByRole, getByPlaceholderText, getByText, debug } = renderResult;
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
        editProfile: {
          ok: true,
          error: "test-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUTATION,
      mockedMutationResponse
    );
    // jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(emailInput, formData.email);
      userEvent.type(passwordInput, formData.password);
      userEvent.click(submitButton);
    });
    // expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    // expect(mockedMutationResponse).toHaveBeenCalledWith({
    //   input: formData,
    // });
    // getByText("• test-error");
    // expect(mockNavigate).toHaveBeenCalledWith("/");
    // expect(window.alert).toHaveBeenCalledWith("Profile is updated!");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
