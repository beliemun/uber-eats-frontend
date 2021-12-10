import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
// import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface ICreateRestaurantFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateRestaurantFormProps>({ mode: "onChange" });
  const client = useApolloClient();
  const [imageUrl, setImageUrl] = useState("");
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    const { name, address, categoryName } = getValues();

    if (ok) {
      setUploading(false);

      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                __typename: "Restaurant",
                id: restaurantId,
                name,
                address,
                coverImage: imageUrl,
                isPromoted: false,
                category: {
                  __typename: "Category",
                  name: categoryName,
                },
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });

      navigate("/");
    }
  };
  const [createRestaurant, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // 기존 식당이 많아질 경우, 너무 많은 데이터를 다시 받아야 하므로 refectch하지 않고 캐시를 수정한다.
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, address, categoryName, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImage);
      createRestaurant({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
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
        <input
          className="input"
          type="file"
          accept="image/*"
          required
          {...register("file", {
            required: "Cover Image is required.",
          })}
        />
        <Button
          text={"Add Restaurant"}
          canClick={isValid && !uploading}
          loading={uploading}
        />
        {data?.createRestaurant.error && (
          <FormError message={data?.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
