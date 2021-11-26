import React from "react";
import { Link } from "react-router-dom";
import { seeRetaurants_seeCategories } from "../__generated__/seeRetaurants";

interface ICategoriesProps {
  seeCategories: seeRetaurants_seeCategories;
}

export const Categories: React.FC<ICategoriesProps> = ({ seeCategories }) => {
  return (
    <div className="flex p-6 mx-auto ">
      {seeCategories.categories?.map((category) => (
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
  );
};
