import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  seeRetaurants,
  seeRetaurantsVariables,
} from "../../__generated__/seeRetaurants";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Link } from "react-router-dom";

const SEE_RESTAURANT_QUERY = gql`
  query seeRetaurants($input: SeeRestaurantsInput!) {
    seeCategories {
      ok
      error
      categories {
        ...CategoryFragment
      }
    }
    seeRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantFragment
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ISearch {
  term: string;
}

export const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<seeRetaurants, seeRetaurantsVariables>(
    SEE_RESTAURANT_QUERY,
    { variables: { input: { page } } }
  );
  const { register, getValues, handleSubmit } = useForm<ISearch>();
  const onSearch = () => {
    const { term } = getValues();
    navigate({ pathname: "/search", search: `?term=${term}` });
  };
  const onNextPage = () => setPage(page + 1);
  const onPrevPage = () => setPage(page - 1);
  return (
    <div>
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
      {!loading && (
        <div className="max-w-4xl mx-auto">
          {/* categories */}
          <div className="flex p-6 mx-auto ">
            {data?.seeCategories.categories?.map((category) => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <div className="group flex-center flex-col cursor-pointer mr-4">
                  <div
                    className="w-16 h-16 bg-cover rounded-full border-4 border-gray-200 group-hover:border-green-500"
                    style={{ backgroundImage: `url(${category.coverImage})` }}
                  />
                  <span className="text-sm mt-2">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* restaurants */}
          <h2 className="text-2xl font-bold p-3">Recommended Retaurants</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.seeRestaurants.results?.map((restaurant) => (
              <Restaurant restaurant={restaurant} key={restaurant.id} />
            ))}
          </div>
          {/* pagination */}
          <div className="flex-center pt-5 pb-10">
            {page > 1 && (
              <button onClick={onPrevPage} className="m-2">
                &larr;
              </button>
            )}
            <span className="text-sm">
              {`Page ${page} of ${data?.seeRestaurants.totalPages}`}
            </span>
            {page !== data?.seeRestaurants.totalPages && (
              <button onClick={onNextPage} className="m-2">
                &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
