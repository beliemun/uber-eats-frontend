import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IAddDishProps {
  name: string;
  price: string; // form에서 오는 값은 모두 string일 수밖에 없다.
  photo: string;
  description: string;
}

export const AddDish: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IAddDishProps>({
    mode: "onChange",
  });
  const { id } = useParams() as { id: string };
  const [createDish, { data, loading: uploading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      { query: MY_RESTAURANT_QUERY, variables: { input: { id: +id } } },
    ],
  });
  const onSubmit = async () => {
    const { name, price, description } = getValues();
    await createDish({
      variables: {
        input: { restaurantId: +id, name, price: +price, description },
      },
    });
    navigate(-1);
  };
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
      </Helmet>
      <h2 className="font-bold text-4xl text-green-400 mb-5">Add Restaurant</h2>
      <h4 className="text-sm text-gray-800 font-medium mb-5">
        Add new dished as fill out the form below.
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
          type="number"
          required
          min={0} // 음수 방지
          placeholder="Price"
          {...register("price", {
            required: "Price is required.",
          })}
        />
        {errors.price?.message && <FormError message={errors.price?.message} />}
        <input
          className="input"
          type="text"
          required
          placeholder="Description"
          {...register("description", {
            required: "Description is required.",
            minLength: {
              value: 10,
              message: "Description should be longer than 10.",
            },
          })}
        />
        {errors.description?.message && (
          <FormError message={errors.description?.message} />
        )}
        <Button
          text={"Add Restaurant"}
          canClick={isValid && !uploading}
          loading={uploading}
        />
        {data?.createDish.error && (
          <FormError message={data?.createDish.error} />
        )}
      </form>
    </div>
  );
};
