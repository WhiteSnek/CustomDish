import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import BGImage from "../assets/bg-image.jpg";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import { IconContext } from "react-icons/lib";
import axios from "axios";

const RestaurantLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setRestaurant } = useContext(UserContext);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // setUser({username,password})
    // Check if email has an account associated with it
    login();
    setUsername("");
    setPassword("");
    setError("");
  };
  const login = async () => {
    try {
      const user = await axios.post(
        "/restaurant/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(user.data.data.restaurant)
      const userInfo = user.data.data.restaurant;
      setRestaurant(userInfo);
      navigate("/");
    } catch (error) {
      // const errorMessage = error.response.data.match(
      //   /<pre>Error: (.*?)<br>/
      // )[1];
      // setError(errorMessage)
      console.log(error)
    }
  };
  const togglePasswordVisibility = () => {
    setShow((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className=" bg-pink-200 rounded-lg w-4/5 h-[80vh] mx-auto my-5 shadow-lg grid grid-cols-12">
      <div className="col-span-6">
        <img src={BGImage} alt="bg-image" className="h-[80vh] aspect-square" />
      </div>
      <div className="col-span-6 p-12 h-full flex flex-col justify-center items-center">
        <h3 className="text-5xl font-bold text-gray-800 pb-5 text-center">
          Sign in
        </h3>
        <form className="space-y-4 p" onSubmit={handleSubmit}>
          <label htmlFor="username">User name:</label>
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <div className="relative">
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-gray-500"
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="absolute top-0 right-0 p-2" onClick={togglePasswordVisibility}>
              {show ?  <IconContext.Provider value={{  size: "27px" }}>
                <BiSolidHide />
              </IconContext.Provider> : <IconContext.Provider value={{  size: "27px" }}>
                <BiSolidShow />
              </IconContext.Provider>}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-400">
              Forgot password?
            </Link>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <Link to="/registerRestaurant" className="text-blue-600 hover:text-blue-400">
            Don't have an account? Sign up
          </Link>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RestaurantLogin;
