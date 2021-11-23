import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCAL_STORAGE_TOKEN } from "./contstant";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {},
  }),
});
