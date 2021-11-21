import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
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
  const [loginMutation, { data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION);
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      {/* w-full, max-w 조합으로 반응형 디자인을 만들기 쉽다.  */}
      <div className="bg-white w-full max-w-lg rounded-lg px-6 py-4 text-center">
        <h3 className="text-xl text-gray-800">Login</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5">
          <input
            type="email"
            required
            placeholder="Email"
            className="input"
            {...register("email", { required: "Email is required." })}
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
              minLength: 6,
            })}
          />
          {errors.password?.type === "minLength" && (
            <FormError message={"Password should be longer than 6."} />
          )}
          <button className="bg-green-800 text-white px-4 py-3 mt-3 rounded-md hover:bg-green-500 transition-all duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
