import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderFromRestaurant from "../components/OrderFromRestaurant";

const Dish = () => {
  const [dish, setDish] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    getDish();
  }, []);
  const getDish = async () => {
    try {
      const dish = await axios.get(`/dish/${id}`, { withCredentials: true });
      setDish(dish.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-12 py-8 px-16 sm:px-20 border-b-2 border-red-500">
        <div className="col-span-4">
          <img
            src={dish?.image}
            alt={dish?.name}
            className="aspect-square h-60 object-cover rounded-xl"
          />
        </div>
        <div className="col-span-8">
          <h1 className="text-xl sm:text-4xl font-bold py-2">{dish?.name}</h1>
          <p className="font-thin text-sm sm:text-lg text-gray-800">{dish?.description}</p>
          <div className="flex items-center justify-between py-8">
          <p className="font-semibold text-lg sm:text-3xl sm:px-4">Price: ₹ {dish?.price}/-</p>
          <div className="flex gap-2 sm:gap-4 items-center">
            <p className="bg-blue-700 text-white py-2 px-2 sm:px-6 rounded-md text-xs sm:text-lg">{dish?.category}</p>
            <p className={`${dish?.type === "spicy" ? "bg-red-400" : "bg-yellow-400"} text-white py-2 px-2 sm:px-6 rounded-md text-xs sm:text-lg`}>{dish?.type}</p>
            </div>
          </div>
          
        </div>
        
      </div>
      <OrderFromRestaurant dish={dish} />
    </div>
  );
};

export default Dish;
