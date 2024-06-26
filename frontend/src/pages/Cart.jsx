import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { RxCross1 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import UserContext from '../context/UserContext';

const CartItem = ({item, getCart}) => {
  const [paymentType, setPaymentType] = useState("");
  const [ingredients, setIngredients] = useState({
    salt: 0,
    sugar: 0,
    onion: 0,
    garlic: 0,
    chilli: 0,
  });
  const [editMode, setEditMode] = useState(false);

  const { user } = useContext(UserContext);
  const [address, setAddress] = useState(user?.address);
  const handleIngredientChange = (ingredient, increment = true) => {
    setIngredients((prevIngredients) => ({
      ...prevIngredients,
      [ingredient]: increment
        ? prevIngredients[ingredient] + 1
        : Math.max(0, prevIngredients[ingredient] - 1),
    }));
  };
  const removeItFromCart = async () => {
    try{
      const cartId = item._id;
        await axios.delete(`/users/remove-cart/${cartId}`,{withCredentials: true})
        await axios.delete(`/cart/remove/${item._id}`,{withCredentials: true});
        getCart()
    } catch(error){
      console.log(error)
    }
  }
  const placeORder = async () => {
    try {
      const dishId = item.dish[0]._id;
      const restaurantId = item.restaurant[0]._id;
      const price = item.price;
      const quantity = item.quantity
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
        removeItFromCart()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='px-6 border-2 border-gray-400 rounded-lg gap-4 relative'>
      <div className='py-8 border-b-2 flex justify-center items-center border-gray-400'>
        <img src={item.dish[0].image} alt={item.dish[0].name} className='h-60 aspect-square rounded-lg object-cover' />
      </div>
      <button onClick={removeItFromCart} title='Delete' className='transition-all absolute top-0 right-0 p-2 hover:bg-gray-50 hover:shadow rounded-full m-2'><RxCross1/></button>
      <div className='flex flex-col justify-center py-8'>
        <h5 className='text-2xl font-bold'>{item.dish[0].name}</h5>
        <p className='text-sm font-thin text-gray-600 '>Ordering from: {item.restaurant[0].fullname}, {item.restaurant[0].address}</p>
        <p></p>
        <p className='text-lg font-thin'>Quantity: {item.quantity}</p>
        <p className='text-xl font-semibold'>Price: ${item.price}</p>
        <div className='flex justify-between'><p className='text-md font-medium'>Deliver to: {item.address}</p><button className='text-blue-700 underline'>Change</button></div>
        
        <Popup
          contentStyle={{
            width: window.innerWidth > 768 ? "50%" :"80%",
            borderRadius: "10px",
            maxHeight: "100vh",
            overflow: "scroll",
          }}
          trigger={
            <button className='bg-yellow-500 py-2 text-white rounded-lg mt-4'>Place Order</button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="p-4 sm:p-10">
              <div className="flex justify-between pb-4">
                <h1 className="text-2xl font-semibold">Complete the details:</h1>{" "}
                <button onClick={() => close()}>
                  <RxCross1 />
                </button>
              </div>
              <div>
                <h1 className="text-lg font-semibold pb-2">
                  Select extra ingredients:{" "}
                </h1>
                <div className="overflow-scroll max-h-40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`${
                      item.dish[0].type === "sweet" &&
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
                      item.dish[0].type === "spicy" &&
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
                      item.dish[0].type === "sweet" &&
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
                      item.dish[0].type === "sweet" &&
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
                      item.dish[0].type === "sweet" &&
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
              <div className="flex justify-center items-center pt-8">
                <button
                  onClick={placeORder}
                  className="py-2 px-4 text-white font-semibold w-1/2 bg-yellow-500 rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  )
}

const Cart = () => {
  const [cart,setCart] = useState([])
  useEffect(()=>{
    getCart()
  },[])
  const getCart = async()=>{
    try {
      const response = await axios.get('/users/cart',{withCredentials: true})

      setCart(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }
    return (
        <div className='p-4 grid grid-cols-1 sm:grid-cols-5  gap-4'>
            {cart.map((item,idx) => (
              <CartItem key={idx} item={item} getCart={getCart} />
            ))}
        </div>
    );
};

export default Cart;
