import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "../../test-utils";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";
import userEvent from "@testing-library/user-event";

// MockedProvider : apollo에서 제공하는 테스트 도구를 사용. useQuery 혹은 useMutation을 통과할 수 있음.
// hook 자체를 mock하면 안되고, hook의 결과에 영향을 줄 수 있도록 mock을 해야 한다.
// MockedProvider는 request와 result를 mock할 수 있게 해준다.
describe("<Header />", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      renderResult = render(
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
                    email: "testEmail",
                    role: "testClient",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Header />
        </MockedProvider>
      );
    });
  });

  it("should render with props", async () => {
    await waitFor(async () => {
      const { getByText } = renderResult;
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("Please verify your email");
    });
  });

  it("should render without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = renderResult;
      await new Promise((resolve) => setTimeout(resolve, 5));
      // getByText()는 대상을 찾지 못하면 바로 Fail을 리턴.
      // queryByText()는 찾지 못할 경우 null을 리턴.
      expect(queryByText("Please verify your email")).toBeNull;
    });
  });

  it("should log user out.", async () => {
    const { getByText } = renderResult;
    const logout = getByText("Logout");
    localStorage.setItem("token", "test-token");
    await waitFor(() => {
      userEvent.click(logout);
    });
    expect(localStorage.getItem("token")).toBeNull();
  });
});
