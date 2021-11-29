import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render } from "../../test-utils";
import { SignUpScreen } from "../sign-up";

describe("<SignUpScreen />", () => {
  const mockedClient = createMockClient();
  it("should render well", () => {
    render(
      <ApolloProvider client={mockedClient}>
        <SignUpScreen />
      </ApolloProvider>
    );
  });
});
