import React from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useMe } from "../../hooks/useMe";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";
import { Helmet } from "react-helmet-async";

export const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IEditProfileForm {
  email?: string;
  password?: string;
}

export const EditProfile: React.FC = () => {
  const { data: userData } = useMe();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IEditProfileForm>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const client = useApolloClient();
  const onCompleted = ({ editProfile: { ok } }: editProfile) => {
    const { email, password } = getValues();
    if (ok && email !== userData?.me.email && userData) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment EditPorofileUser on User {
            email
            verified
          }
        `,
        data: {
          email,
          verified: false,
        },
      });
    }
    if (email !== userData?.me.email || password) {
      alert("Profile is updated!");
    }
  };
  const [editProfile, { data: editProfileMutationResult, loading }] =
    useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
      onCompleted,
      onError: (message) => console.log(message),
    });
  const onSubmit = () => {
    const { email, password } = getValues();
    if (email === userData?.me.email && password === "") {
      // 이메일이 변하지 않았고, 비밀번호를 변경하지 않았다면
      return;
    }
    if (!loading) {
      editProfile({
        variables: {
          input: {
            email,
            ...(password !== "" && { password }),
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-32 mx-10">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center">
        <h2 className="font-bold text-4xl text-green-400 mb-5">Edit Profile</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 my-5 w-full"
        >
          <input
            type="email"
            placeholder="Email"
            className="input"
            required
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
            placeholder="Password"
            className="input"
            {...register("password", {
              minLength: 4,
            })}
          />
          {errors.password?.type === "minLength" && (
            <FormError message={"Password should be longer than 4."} />
          )}
          <Button text={"Edit Profile"} canClick={isValid} loading={loading} />
          {editProfileMutationResult?.editProfile.error && (
            <FormError message={editProfileMutationResult?.editProfile.error} />
          )}
        </form>
      </div>
    </div>
  );
};
