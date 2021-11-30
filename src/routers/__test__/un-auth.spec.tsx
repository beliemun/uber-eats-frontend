import { MockedProvider } from "@apollo/client/testing";
import { RenderResult } from "@testing-library/react";
import { ME_QUERY } from "../../hooks/useMe";
import { render, waitFor } from "../../test-utils";
import { UserRole } from "../../__generated__/globalTypes";
import { UnAuth } from "../un-auth";

describe("<UnAuth />", () => {
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
          <UnAuth />
        </MockedProvider>
      );
    });
  });

  it("should render well", async () => {
    const {} = renderResult;
    waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
