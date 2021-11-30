import { RenderResult, waitFor } from "@testing-library/react";
import { render } from "../../test-utils";
import { UserRole } from "../../__generated__/globalTypes";
import { Auth } from "../auth";
import { ME_QUERY } from "../../hooks/useMe";
import { MockedProvider } from "@apollo/client/testing";

describe("<Auth />", () => {
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
                    email: "test@test.com",
                    role: UserRole.Client,
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Auth />
        </MockedProvider>
      );
    });
  });

  it("should render well", async () => {
    const { getByText } = renderResult;
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    // 로그인 정보로 확인
    getByText("test@test.com");
  });
});
