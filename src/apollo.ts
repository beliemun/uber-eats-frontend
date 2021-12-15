import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { LOCAL_STORAGE_TOKEN } from "./contstant";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://beliemun-uber-eats-backend.herokuapp.com/graphql"
      : "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      token: authToken() || "",
    },
  },
});

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://beliemun-uber-eats-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: authToken() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {},
  }),
});
