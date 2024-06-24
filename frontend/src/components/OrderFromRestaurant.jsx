import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RxCross1 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import axios from "axios";
import UserContext from "../context/UserContext";

const RestaurantCard = ({ item, dish }) => {
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState({
    salt: 0,
    sugar: 0,
    onion: 0,
    garlic: 0,
    chilli: 0,
  });
  const [paymentType, setPaymentType] = useState("");
  const [editMode, setEditMode] = useState(false);

  const { user,setUser } = useContext(UserContext);
  const [address, setAddress] = useState(user?.address);
  const editEditMode = () => {
    setEditMode(!editMode);
  };
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  const handleIngredientChange = (ingredient, increment = true) => {
    setIngredients((prevIngredients) => ({
      ...prevIngredients,
      [ingredient]: increment
        ? prevIngredients[ingredient] + 1
        : Math.max(0, prevIngredients[ingredient] - 1),
    }));
  };

  const addOrder = async () => {
    try {
      const dishId = dish._id;
      const restaurantId = item._id;
      const price = quantity * dish.price;
      const addIngredient = await axios.post("/ingredient/", ingredients, {
        withCredentials: true,
      });
      const ingredientId = addIngredient.data._id;
      const response = await axios.post(
        "/order/",
        {
          dishId,
          quantity,
          price,
          paymentType,
          address,
          restaurantId,
          ingredientId,
        },
        { withCredentials: true }
      );
      const orderId = response.data.data._id;
      const order = await axios
        .post(`/users/orders/${orderId}`, {}, { withCredentials: true })
        .then((result) => {
          if (result) {
            setQuantity(1);
            setIngredients({
              salt: 0,
              sugar: 0,
              onion: 0,
              garlic: 0,
              chilli: 0,
            });
            setPaymentType("");
          }
        });
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      setError(errorMessage);
    }
  };
  console.log(user);


  const addToCart = async() => {
    try {
      const dishId = dish._id;
      const restaurantId = item._id;
      const price = quantity * dish.price;
      const addIngredient = await axios.post("/ingredient/", ingredients, {
        withCredentials: true,
      });
      console.log(addIngredient)
      const ingredientId = addIngredient.data._id;
      const response = await axios.post(
        "/cart/add",
        {
          dishId,
          quantity,
          price,
          address,
          restaurantId,
          ingredientId,
        },
        { withCredentials: true }
      );
      console.log(response)
      const cartId = response.data.data._id;
      console.log(cartId)
      const cart = await axios
        .post(`/users/cart`, {cartId}, { withCredentials: true })
        .then((result) => {
          if (result) {
            setQuantity(1);
            setIngredients({
              salt: 0,
              sugar: 0,
              onion: 0,
              garlic: 0,
              chilli: 0,
            });
            setPaymentType("");
          }
        });
        // setUser(cart.data.data)
        console.log("cart",cart)
    } catch (error) {
      const errorMessage = error.response.data.match(
        /<pre>Error: (.*?)<br>/
      )[1];
      setError(errorMessage);
    }
  }
  return (
    <div className="bg-gray-100 p-8 rounded-lg hover:shadow-xl">
      <Link
        to={`/restaurantProfile/${item._id}`}
        className="flex justify-center mb-4"
      >
        <img
          src={item.avatar}
          alt="logo"
          className="w-80 aspect-square object-cover rounded-lg"
        />
      </Link>
      <div className="text-lg">
        <div className="flex justify-between ">
          <h2>{item.fullname}</h2>
          <span className="bg-green-800 text-white px-2 py-1 rounded-lg">
            {item.rating}
          </span>
        </div>
        <div className=" text-gray-600 font-thin">
          <p className="text-sm">{item.username}</p>
          <h3>{item.email}</h3>
        </div>
        <div className="font-thin text-gray-500">{item.address}</div>

        <Popup
          contentStyle={{
            width: window.innerWidth > 768 ? "50%" :"80%",
            borderRadius: "10px",
            maxHeight: "100vh",
            overflow: "scroll",
          }}
          trigger={
            <button className="w-full bg-green-600 py-2 px-6 text-white rounded-lg my-2 transition-all hover:text-xl">
              Order
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="p-2 sm:p-10">
              <div className="flex justify-between pb-4">
                <h1 className="text-lg sm:text-2xl font-semibold">Place an Order</h1>{" "}
                <button onClick={() => close()}>
                  <RxCross1 />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 py-8 px-2 px-auto sm:px-4 border-b-2 border-red-500">
                <div className="col-span-4">
                  <img
                    src={dish?.image}
                    alt={dish?.name}
                    className="aspect-square h-40 object-cover rounded-xl mx-auto sm:mx-0"
                  />
                </div>
                <div className="col-span-8">
                  <h1 className="text-xl font-bold pt-2 sm:pt-0">{dish?.name}</h1>
                  <p className="font-thin text-sm text-gray-800">
                    {dish?.description}
                  </p>
                  <div className="flex items-center justify-between py-2">
                    <p className="font-semibold text-md sm:text-xl">
                      Price: ₹ {dish?.price}/-
                    </p>
                    <div className="flex gap-4 items-center">
                      <p className="bg-blue-700 text-white py-2 px-4 rounded-md text-sm">
                        {dish?.category}
                      </p>
                      <p
                        className={`${
                          dish?.type === "spicy"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                        } text-white  py-2 px-4 rounded-md text-sm`}
                      >
                        {dish?.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <h2 className="text-md sm:text-xl font-semibold">
                  Ordering from: {item.fullname}
                </h2>
                <div className="flex justify-between">
                  <p className="text-sm sm:text-lg font-thin">{item.address}</p>
                  <p className="bg-green-800 text-white px-2 py-1 rounded-lg">
                    {item.rating}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 text-md sm:text-lg items-center">
                  <h3>Quantity: </h3>
                  <div className="  border border-gray-700 rounded-md flex gap-2 sm:gap-4 justify-center items-center">
                    <button
                      onClick={handleIncrement}
                      className="bg-gray-200 p-2 border-r border-gray-700"
                    >
                      <GoPlus />
                    </button>
                    <span className="">{quantity}</span>
                    <button
                      onClick={handleDecrement}
                      className="bg-gray-200 p-2 border-l border-gray-700"
                    >
                      <FiMinus />
                    </button>
                  </div>
                </div>
                <p className="text-md sm:text-lg font-bold">
                  Total: ₹ {dish.price * quantity}/-
                </p>
              </div>
              <div className="flex justify-between py-4 text-lg font-thin">
                <p className="flex gap-2 items-center w-full">
                  Deliver to:
                  {editMode ? (
                    <input
                      type="text"
                      defaultValue={address}
                      onBlur={() => setEditMode(false)}
                      onChange={(e) => setAddress(e.target.value)}
                      className="outline-none border w-3/4 border-gray-700 py-2 px-4 rounded-lg"
                    />
                  ) : (
                    <p>
                      {" "}
                      {address ? (
                        address
                      ) : (
                        <Link to="/edit/#edit-address" className="underline">
                          Add address
                        </Link>
                      )}
                    </p>
                  )}
                </p>
                <button
                  onClick={editEditMode}
                  className="underline text-blue-700"
                >
                  Change
                </button>
              </div>
              <div>
                <h1 className="text-md sm:text-lg font-semibold pb-2">
                  Select extra ingredients:{" "}
                </h1>
                <div className="overflow-scroll max-h-40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`${
                      dish.type === "sweet" &&
                      "pointer-events-none opacity-50 border-gray-400"
                    } flex justify-between items-center p-4 border-2 border-green-400 rounded-lg`}
                  >
                    <h3 className="text-lg">Salt: </h3>
                    <div className="  border border-gray-700 rounded-md flex gap-4 justify-center items-center">
                      <button
                        onClick={() => handleIngredientChange("salt", true)}
                        className="bg-gray-200 p-2 border-r border-gray-700"
                      >
                        <GoPlus />
                      </button>
                      <span className="">{ingredients.salt}</span>
                      <button
                        onClick={() => handleIngredientChange("salt", false)}
                        className="bg-gray-200 p-2 border-l border-gray-700"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${
                      dish.type === "spicy" &&
                      "pointer-events-none opacity-50 border-gray-400"
                    } flex justify-between items-center p-4 border-2 border-green-400 rounded-lg`}
                  >
                    <h3 className="text-lg">Sugar: </h3>
                    <div className="  border border-gray-700 rounded-md flex gap-4 justify-center items-center ">
                      <button
                        onClick={() => handleIngredientChange("sugar", true)}
                        className="bg-gray-200 p-2 border-r border-gray-700"
                      >
                        <GoPlus />
                      </button>
                      <span className="">{ingredients.sugar}</span>
                      <button
                        onClick={() => handleIngredientChange("sugar", false)}
                        className="bg-gray-200 p-2 border-l border-gray-700"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`${
                      dish.type === "sweet" &&
                      "pointer-events-none opacity-50 border-gray-400"
                    } flex justify-between items-center p-4 border-2 border-green-400 rounded-lg`}
                  >
                    <h3 className="text-lg">Onion: </h3>
                    <div className="  border border-gray-700 rounded-md flex gap-4 justify-center items-center">
                      <button
                        onClick={() => handleIngredientChange("onion", true)}
                        className="bg-gray-200 p-2 border-r border-gray-700"
                      >
                        <GoPlus />
                      </button>
                      <span className="">{ingredients.onion}</span>
                      <button
                        onClick={() => handleIngredientChange("onion", false)}
                        className="bg-gray-200 p-2 border-l border-gray-700"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${
                      dish.type === "sweet" &&
                      "pointer-events-none opacity-50 border-gray-400"
                    } flex justify-between items-center p-4 border-2 border-green-400 rounded-lg`}
                  >
                    <h3 className="text-lg">Garlic: </h3>
                    <div className="  border border-gray-700 rounded-md flex gap-4 justify-center items-center">
                      <button
                        onClick={() => handleIngredientChange("garlic", true)}
                        className="bg-gray-200 p-2 border-r border-gray-700"
                      >
                        <GoPlus />
                      </button>
                      <span className="">{ingredients.garlic}</span>
                      <button
                        onClick={() => handleIngredientChange("garlic", false)}
                        className="bg-gray-200 p-2 border-l border-gray-700"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${
                      dish.type === "sweet" &&
                      "pointer-events-none opacity-50 border-gray-400"
                    } flex justify-between items-center p-4 border-2 border-green-400 rounded-lg`}
                  >
                    <h3 className="text-lg">Chilli: </h3>
                    <div className="  border border-gray-700 rounded-md flex gap-4 justify-center items-center">
                      <button
                        onClick={() => handleIngredientChange("chilli", true)}
                        className="bg-gray-200 p-2 border-r border-gray-700"
                      >
                        <GoPlus />
                      </button>
                      <span className="">{ingredients.chilli}</span>
                      <button
                        onClick={() => handleIngredientChange("chilli", false)}
                        className="bg-gray-200 p-2 border-l border-gray-700"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <form className="p-4 border-2 border-gray-400 rounded-lg m-4 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-md sm:text-xl font-semibold py-2">
                  Select a mode of payment:
                </h1>
                <div className="w-full sm:w-1/2">
                  <div className="flex justify-between">
                    <label htmlFor="cash">Cash</label>
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentType === "cash"}
                      onChange={(e) => setPaymentType(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="debit-card">Debit Card</label>
                    <input
                      type="radio"
                      value="debit_card"
                      checked={paymentType === "debit_card"}
                      onChange={(e) => setPaymentType(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="upi">UPI</label>
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentType === "upi"}
                      onChange={(e) => setPaymentType(e.target.value)}
                    />
                  </div>
                </div>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 px-8">
                <button onClick={addToCart}
                  className="py-2 px-4 font-semibold text-white bg-yellow-500 rounded-lg"
                >
                  Add to cart
                </button>
                <button
                  onClick={addOrder}
                  className="py-2 px-4 text-white font-semibold bg-yellow-500 rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

const OrderFromRestaurant = ({ dish }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get("/restaurant/restaurants", {
          withCredentials: true,
        });
        const allRestaurants = response.data.data;
        // Filter restaurants to include only those that have the specific dish
        const filteredRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.dishes.some((resdish) => resdish === dish?._id)
        );
        setRestaurants(filteredRestaurants);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, [dish?._id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-lg sm:text-4xl font-bold px-4 pb-10">
        Available in these Restaurants
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
        {restaurants.map((item) => (
          <RestaurantCard key={item._id} item={item} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default OrderFromRestaurant;
