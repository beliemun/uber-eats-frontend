import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import uberLogo from "../images/uber-eats-logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { useNavigate } from "react-router-dom";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface ISignUpForm {
  email: string;
  password: string;
  role: UserRole;
}

export const SignUpScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ISignUpForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const navigate = useNavigate();

  const onCompleted = ({
    createAccount: { ok, error },
  }: createAccountMutation) => {
    if (ok) {
      alert("Account Created. Sign in now!");
      navigate("/");
    }
  };
  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          input: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-32 mx-10">
      <Helmet>
        <title>Sign Up | Uber Eats</title>
      </Helmet>
      {/* w-full, max-w 조합으로 반응형 디자인을 만들기 쉽다.  */}
      {/* 부모가 items-center를 가지고 있다면 자식중 하나가 width를 가지고 있어야 한다. */}
      <div className="w-full max-w-screen-sm flex flex-col items-center">
        <img src={uberLogo} alt="logo" className="w-48 mb-10" />
        <h4 className="w-full text-left text-2xl font-medium">
          Let's get started
        </h4>
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
              required: "Email is required.",
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
              required: "Password is required.",
              minLength: 4,
            })}
          />
          {errors.password?.type === "minLength" && (
            <FormError message={"Password should be longer than 4."} />
          )}
          <select className="input" {...register("role", { required: true })}>
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            text={"Create Account"}
            canClick={isValid}
            loading={loading}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              message={createAccountMutationResult?.createAccount.error}
            />
          )}
        </form>
        <div>
          <span className="text-sm">Already have an account? </span>
          <Link
            to="/"
            className="text-sm font-medium text-rose-400 hover:underline"
          >
            Sign in now
          </Link>
        </div>
      </div>
    </div>
  );
};
