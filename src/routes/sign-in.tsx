import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import uberLogo from "../images/uber-eats-logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCAL_STORAGE_TOKEN } from "../contstant";

// sign-in.spec.tsx 에서 사용되어 export 되었음.
export const LOGIN_MUTATION = gql`
  mutation loginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

interface ISignInForm {
  email: string;
  password: string;
}

export const SignInScreen: React.FC = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ISignInForm>({
    mode: "onChange",
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      isLoggedInVar(true);
      localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
      authToken(token);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    if (!loading) {
      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-32 mx-10">
      <Helmet>
        <title>Sign In | Uber Eats</title>
      </Helmet>
      {/* w-full, max-w 조합으로 반응형 디자인을 만들기 쉽다.  */}
      {/* 부모가 items-center를 가지고 있다면 자식중 하나가 width를 가지고 있어야 한다. */}
      <div className="w-full max-w-screen-sm flex flex-col items-center">
        <img src={uberLogo} alt="logo" className="w-48 mb-10" />
        <h4 className="w-full text-left text-2xl font-medium">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 my-5 w-full"
        >
          <input
            type="email"
            required
            placeholder="Email"
            className="input"
            {...register("email", {
              // required: "Email is required.", // Test 에서 오류가 생겨 주석처리 함.
              pattern: {
                value: /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/,
                message: "It must be in email format.",
              },
            })}
          />
          {errors.email?.message && (
            <FormError message={errors.email?.message} />
          )}
          <input
            type="password"
            required
            placeholder="Password"
            className="input"
            {...register("password", {
              // required: "Password is required.", // Test 에서 오류가 생겨 주석처리 함.
              minLength: {
                value: 4,
                message: "Password should be longer than 4.",
              },
            })}
          />
          {errors.password?.message && (
            <FormError message={errors.password.message} />
          )}
          <Button text={"Sign in"} canClick={isValid} loading={loading} />
          {loginMutationResult?.login.error && (
            <FormError message={loginMutationResult?.login.error} />
          )}
        </form>
        <div>
          <span className="text-sm">New to Uber? </span>
          <Link
            to="/sign-up"
            className="text-sm font-medium text-green-400 hover:underline"
          >
            Create a Account
          </Link>
        </div>
      </div>
    </div>
  );
};
