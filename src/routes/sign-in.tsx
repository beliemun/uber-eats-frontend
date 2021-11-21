import React from "react";
import { useForm } from "react-hook-form";

interface ISignInForm {
  email: string;
  password: string;
}

export const SignInScreen = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInForm>();
  const onSubmit = () => {
    console.log(getValues());
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
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
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
            <span className="text-red-600">
              Password should be longer than 6.
            </span>
          )}
          <button className="bg-green-800 text-white px-4 py-3 mt-3 rounded-md hover:bg-green-500 transition-all duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
