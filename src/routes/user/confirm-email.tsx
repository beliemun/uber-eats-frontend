import React, { useEffect } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";
import { useMe } from "../../hooks/useMe";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail: React.FC = () => {
  const { data: userData } = useMe();
  const navigatie = useNavigate();
  const client = useApolloClient();
  const onCompleted = ({ verifyEmail: { ok } }: verifyEmail) => {
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
    }
    navigatie("/");
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    { onCompleted }
  );

  const location = useLocation();
  const code = location.search.split("?code=")[1];
  useEffect(() => {
    setTimeout(() => {
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    }, 1000);
  }, [verifyEmail, code]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Helmet>
        <title>Confirm Your Email | Uber Eats</title>
      </Helmet>
      <h2 className="font-bold text-4xl text-rose-500 mb-5">
        Confirming Email...
      </h2>
      <h4 className="text-sm font-medium mb-5">
        Please wait, Do not close this page.
      </h4>
    </div>
  );
};
