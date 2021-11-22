import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
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

    formState: { errors },
  } = useForm<ISignInForm>();
  const onCompleted = ({ login: { ok, error, token } }: loginMutation) => {
    console.log(token);
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
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      {/* w-full, max-w 조합으로 반응형 디자인을 만들기 쉽다.  */}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5">
        <input
          type="email"
          required
          placeholder="Email"
          className="input"
          {...register("email", { required: "Email is required." })}
        />
        {errors.email?.message && <FormError message={errors.email?.message} />}
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
        <button
          className="bg-green-800 text-white px-4 py-3 mt-3 rounded-md hover:bg-green-500 transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        {loginMutationResult?.login.error && (
          <FormError message={loginMutationResult?.login.error} />
        )}
      </form>
    </div>
  );
};
