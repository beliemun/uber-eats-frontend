import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

interface ISearch {
  term: string;
}

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { register, getValues, handleSubmit } = useForm<ISearch>();
  const onSearch = () => {
    const { term } = getValues();
    navigate({ pathname: "/search", search: `?term=${term}` });
  };
  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="bg-gray-800 w-full py-8 sm:py-28 flex justify-center items-center"
    >
      <input
        className="input w-3/4 sm:w-7/12 rounded-md"
        type="search"
        required
        placeholder="Search Restaurants..."
        {...register("term", {
          required: "Term is required.",
        })}
      />
    </form>
  );
};
