import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface ICreateRestaurantFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant: React.FC = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateRestaurantFormProps>({ mode: "onChange" });
  const [createRestaurant, { data, loading }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);
  const onSubmit = () => {
    const { name, address, categoryName } = getValues();
    createRestaurant({
      variables: {
        input: {
          name,
          address,
          categoryName,
          coverImage: "http://",
        },
      },
    });
  };
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <Helmet>
        <title>Add Restaurant| Uber Eats</title>
      </Helmet>
      <h2 className="font-bold text-4xl text-green-400 mb-5">Add Restaurant</h2>
      <h4 className="text-sm font-medium mb-5">
        Fill the form out to add your restaurant.
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 my-5 w-full"
      >
        <input
          className="input"
          type="text"
          required
          placeholder="Name"
          {...register("name", {
            required: "Name is required.",
            minLength: {
              value: 4,
              message: "Name should be longer than 4.",
            },
          })}
        />
        {errors.name?.message && <FormError message={errors.name?.message} />}
        <input
          className="input"
          type="text"
          required
          placeholder="Address"
          {...register("address", {
            required: "Address is required.",
            minLength: {
              value: 4,
              message: "Address should be longer than 4.",
            },
          })}
        />
        {errors.address?.message && (
          <FormError message={errors.address?.message} />
        )}
        <input
          className="input"
          type="text"
          required
          placeholder="Category Name"
          {...register("categoryName", {
            required: "Category Name is required.",
            minLength: {
              value: 4,
              message: "Category Name should be longer than 4.",
            },
          })}
        />
        {errors.categoryName?.message && (
          <FormError message={errors.categoryName?.message} />
        )}
        <Button text={"Add Restaurant"} canClick={isValid} loading={loading} />
        {data?.createRestaurant.error && (
          <FormError message={data?.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
