import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RxCross1 } from "react-icons/rx";
import { data } from "../constants";
import UserContext from "../context/UserContext";
const DishCard = ({ item,restaurantDishes,setRestaurantDishes }) => {
  
  const dishId = item._id;
  const addDish = async() => {
    try {
        const response = await axios.post('/restaurant/dishes',{dishId},{withCredentials: true})
        setRestaurantDishes([...restaurantDishes, item._id])
        console.log(restaurantDishes)
    } catch (error) {
        console.log(error)
    }
}
  return (
    <div
      className={`flex col-span-1 gap-4 p-4 m-2 border-2 ${
        item.isVeg ? "border-green-500" : "border-red-500"
      } rounded-lg w-full hover:shadow-lg hover:scale-[1.01] transition-all`}
    >
      <div className="">
        <img
          src={item.image}
          alt={item.name}
          className="w-48 aspect-square rounded-lg object-cover "
        />
      </div>
      <div className="w-full pl-10 flex">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold">{item.name}</h2>
          <p className="text-md font-thin text-gray-600 ">{item.description}</p>
        </div>
        <div className="w-1/3 flex flex-col items-end relative">
          <div className="flex gap-4 ">
            <p className="text-lg  rounded-lg bg-blue-700 py-2 px-4 text-center text-white">
              {item.category}
            </p>
            <span
              className={`${
                item.type == "spicy" ? "bg-red-400" : "bg-yellow-400"
              } py-2 px-4 rounded-lg text-white items-center`}
            >
              {item.type}
            </span>
          </div>
          <div className="flex gap-2 absolute bottom-0 right-0">
            <p className="text-3xl font-semibold">Price: Rs {item.price}</p>
            <button onClick={()=>addDish()} className="bg-red-500 py-2 px-4 text-white rounded-lg">
              {restaurantDishes.includes(item._id) ? 'Dish Added' : 'Add Dish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {restaurant} = useContext(UserContext)
  const [restaurantDishes,setRestaurantDishes] = useState([])
  const [details, setDetails] = useState({
    name: "",
    description: '',
    category: "",
    price: "",
    isVeg: false,
    type: "",
    image: null,
    imageUrl: "",
  });

  useEffect(() => {
    getDishes();
    getResDishes();
  }, []);
  const getResDishes = async() => {
    try {
      const response = await axios.get(`/restaurant/dishes/${restaurant._id}`,{withCredentials: true})
      console.log(response.data.data)
      setRestaurantDishes(response.data.data.map(item => item._id))
    } catch (error) {
      console.log(error)
    }
  }
  console.log(restaurantDishes)
  const getDishes = async () => {
    try {
      const response = await axios.get("/dish/all", { withCredentials: true });
      setDishes(response.data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDetails({
      ...details,
      image: e.target.files[0],
      imageUrl: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name,description, isVeg, type, category, price, image } = details;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isVeg", isVeg);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("image", image);
      console.log(formData);
      const response = await axios.post("/dish/add", formData, {
        withCredentials: true,
      });
      console.log(response);
      setDetails({name: "",
        description: '',
        category: "",
        price: "",
        isVeg: false,
        type: "",
        image: null,
        imageUrl: "",})
      getDishes()
    } catch (error) {
      console.log(error);
    }
  };

  const handleVegChange = (event) => {
    setDetails({
      ...details,
      isVeg: event.target.value === "veg",
    });
  };

  const handleTypeChange = (event) => {
    setDetails({
      ...details,
      type: event.target.value,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="p-10 ">
      <h1 className="text-3xl font-bold ">Available Dishes</h1>
      <div className="grid grid-col-2 justify-center items-center">
        {dishes.length === 0 ? (
          <p className="font-thin text-gray-500">No dishes found</p>
        ) : (
          dishes.map((item, idx) => <DishCard key={idx} item={item} restaurantDishes={restaurantDishes} setRestaurantDishes={setRestaurantDishes} />)
        )}
      </div>
      <div className="fixed bottom-0 right-0 px-10 py-4 w-full flex justify-end shadow-lg bg-slate-100">
        <Popup
          contentStyle={{ width: "50%", borderRadius: "10px" }}
          trigger={
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
              Add Dishes
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="p-10">
              <div className="flex justify-between pb-4">
                <h1 className="text-2xl font-semibold">Add a Dish</h1>{" "}
                <button onClick={() => close()}>
                  <RxCross1 />
                </button>
              </div>

              <div>
                <form className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-lg font-md">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={details.name}
                    onChange={(e) =>
                      setDetails({ ...details, name: e.target.value })
                    }
                    className="outline-none p-2 border-b bg-gray-100 border-gray-600 rounded-md"
                  />
                  <label htmlFor="description" className="text-lg font-md">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    value={details.description}
                    onChange={(e) =>
                      setDetails({ ...details, description: e.target.value })
                    }
                    className="outline-none p-2 border-b bg-gray-100 border-gray-600 rounded-md"
                  />
                  <div className="w-full grid grid-cols-2 gap-2  items-center">
                    <div>
                      <label
                        htmlFor="category"
                        className="text-lg font-md pr-4"
                      >
                        Category:
                      </label>
                      <select
                        name="category"
                        id="category"
                        className="w-1/2 outline-none p-2 border-b bg-gray-100 border-gray-600 rounded-md"
                        value={details.category}
                        onChange={(e) =>
                          setDetails({ ...details, category: e.target.value })
                        }
                      >
                        {data.map((item, idx) => (
                          <option key={idx} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="veg" className="text-lg font-md">
                        Veg:
                      </label>
                      <input
                        type="radio"
                        value="veg"
                        id="veg"
                        checked={details.isVeg}
                        onChange={handleVegChange}
                      />
                      <label htmlFor="nonveg" className="text-lg font-md">
                        Non-Veg:
                      </label>
                      <input
                        type="radio"
                        value="nonveg"
                        id="nonveg"
                        checked={!details.isVeg}
                        onChange={handleVegChange}
                      />
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2  items-center">
                  <div>
                  <label htmlFor="price" className="text-lg font-md">
                    Price (in Rs):
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    id="price"
                    value={details.price}
                    onChange={(e) =>
                      setDetails({ ...details, price: e.target.value })
                    }
                    className="outline-none p-2 border-b bg-gray-100 border-gray-600 rounded-md"
                  />
                  </div>
                  <div>
                  <div className="flex gap-2">
                  <label htmlFor="spicy" className="text-lg font-md">
                      Spicy:
                    </label>
                    <input
                      type="radio"
                      value="spicy"
                      id="spicy"
                      checked={details.type === "spicy"}
                      onChange={handleTypeChange}
                    />
                    <label htmlFor="sweet" className="text-lg font-md">
                      Sweet:
                    </label>
                    <input
                      type="radio"
                      value="sweet"
                      id="sweet"
                      checked={details.type === "sweet"}
                      onChange={handleTypeChange}
                    />
                    </div>
                  </div>
                  </div>
                  <label htmlFor="image" className="text-lg font-md">
                    Image:
                  </label>
                  <input
                    className="border border-blue-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    id="avatar"
                    type="file"
                    onChange={handleChange}
                  />
                  {details.imageUrl && (
                    <img
                      src={details.imageUrl}
                      alt="Avatar Preview"
                      className="w-20 h-20"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      handleSubmit(e);
                      close();
                  }}
                    type="button"
                    className="py-2 px-4 bg-red-600 text-white font-semibold text-lg rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default Dishes;
