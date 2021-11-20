import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = () => {
    console.log(watch(["email"]));
  };

  const onInvalid = () => {
    console.log(errors);
    console.log("Can't create an account.");
  };

  return (
    <>
      <h1>Logged Out Screen</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            type="email"
            required
            placeholder="Email"
            {...register("email", {
              required: "Email is required.",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required.",
            })}
          />
        </div>
        <button className="bg-yellow-600 text-white">Submit</button>
      </form>
    </>
  );
};
