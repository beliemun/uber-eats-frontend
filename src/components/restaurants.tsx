import React from "react";
import { seeRetaurants_seeRestaurants_results } from "../__generated__/seeRetaurants";
import { Restaurant } from "./restaurant";

interface IRestaurantsProps {
  title: string;
  restaurants: seeRetaurants_seeRestaurants_results[] | null;
  totalPages: number | null;
  page: number;
  setPage: (value: React.SetStateAction<number>) => void;
}

export const Restaurants: React.FC<IRestaurantsProps> = ({
  title,
  restaurants,
  totalPages,
  page,
  setPage,
}) => {
  const onNextPage = () => setPage(page + 1);
  const onPrevPage = () => setPage(page - 1);
  return (
    <>
      <h2 className="text-2xl font-bold py-3">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {restaurants?.map((restaurant) => (
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
        <span className="text-sm">{`Page ${page} of ${totalPages}`}</span>
        {page !== totalPages && (
          <button onClick={onNextPage} className="m-2">
            &rarr;
          </button>
        )}
      </div>
    </>
  );
};
