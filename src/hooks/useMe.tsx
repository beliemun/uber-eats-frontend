import { gql, useQuery } from "@apollo/client";
import { me } from "../__generated__/me";

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => useQuery<me>(ME_QUERY);
