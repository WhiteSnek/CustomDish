import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DishesCard = ({item}) => {

    return (
        <Link to={`/dish/${item._id}`} className="flex flex-col justify-center items-center transition-all bg-gray-100 p-4 rounded-lg hover:scale-105">
            <img src={item.image} alt={item.name} className='h-40 aspect-square object-cover rounded-lg' />
            <h2 className='text-lg font-semibold'>{item.name}</h2>
            <div className='flex gap-2 text-xs'><span className='bg-blue-600 text-white px-2 py rounded-full'>{item.category}</span><span  className={`${
                item.type == "spicy" ? "bg-red-400" : "bg-yellow-400"
              } text-white px-2 py rounded-full`}>{item.type}</span><span  className={`${
                item.isVeg? "bg-green-500" : "bg-red-500"
              } text-white px-2 py rounded-full`}>{item.isVeg ? "Veg": "Non-veg"}</span></div>
        </Link>
    );
}

const PopularDishes = () => {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    getAllDishes()
  }, []);
  const getAllDishes = async() => {
    try {
      const response = await axios.get('/dish/all',{withCredentials: true});
      setRecipes(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold pb-10">Popular Dishes</h1>
    <div className="grid grid-cols-6 gap-6">
      {recipes.map((item, idx) => (
        <DishesCard key={idx} item={item} />
      ))}
    </div>
    </div>
  );
};

export default PopularDishes;
