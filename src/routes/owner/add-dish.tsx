import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
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
  [key: string]: string; // 동적으로 타입을 늘릴 때 이와 같은 방법으로 추가한다.
}

export const AddDish: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    unregister,
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
    const { name, price, description, ...rest } = getValues();
    const optionObject = options.map((option) => ({
      name: rest[`option-name-${option}`],
      extra: +rest[`option-extra-${option}`],
    }));
    console.log(optionObject);
    await createDish({
      variables: {
        input: {
          restaurantId: +id,
          name,
          price: +price,
          description,
          options: optionObject,
        },
      },
    });
    navigate(-1);
  };
  const [options, setOptions] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptions((current) => [...current, Date.now()]);
  };
  const onDeleteOptionClick = (id: number) => {
    setOptions((current) => current.filter((option) => option !== id));
    unregister(`option-name-${id}`);
    unregister(`option-extra-${id}`);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

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
        <div className="my-6">
          <h4 className="text-sm text-gray-800 font-medium my-4">
            Dish Options
          </h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-green-500 px-4 py-2 inline-block"
          >
            + Dish Options
          </span>
          {options.length !== 0 &&
            options.map((optionId) => (
              <div key={optionId} className="mt-3 ml-3">
                <input
                  className="input"
                  type="text"
                  placeholder="Option Name"
                  {...register(`option-name-${optionId}`)}
                />
                <input
                  className="input"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                  {...register(`option-extra-${optionId}`)}
                />
                <span
                  onClick={() => onDeleteOptionClick(optionId)}
                  className="cursor-pointer text-sm text-green-500 px-2"
                >
                  Delete
                </span>
              </div>
            ))}
        </div>
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
