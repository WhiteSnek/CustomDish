import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IconContext } from "react-icons/lib";
import { CiShoppingCart } from "react-icons/ci";
import Logo from "../assets/logo.png";
import UserContext from "../context/UserContext";
import axios from "axios";

export default function Header() {
  const { user,restaurant } = useContext(UserContext);
  const [query,setQuery] = useState('');
  const {setSearch} = useContext(UserContext)
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(query)
  }
  return (
    <header className="shadow w-full">
      <div className="flex justify-between items-center sm:gap-10 px-2 sm:px-10 py-2">
        <Link to="/" className="flex gap-4 justify-center items-center">
          <img src={Logo} alt="logo" className="h-10 sm:h-14 aspect-square" />
          {window.innerWidth > 768 && <p className="text-lg text-red-900 font-bold">CustomDish.com</p>}
        </Link>
        <div className="px-4 w-18 sm:w-30">
          {/* Address of user */}
          <p className="text-xs sm:text-md">Deliver to {user?.address ? user.address : "address" }</p>
        </div>
        <div className="w-1/3 shadow sm:block hidden">
          {/* TODO: Add functionality to search bar */}
          <form className="relative" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search"
              className="w-11/12 outline-none border-2 rounded-l-lg  border-gray-200 py-2 px-4"
              onChange={(e)=>setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute top-0 right-0 py-2 px-4 bg-red-700 text-white text-xl rounded-r-lg"
              
            >
              Search
            </button>
          </form>
        </div>
        <div>{/* region */}</div>
        <div className="flex gap-2 justify-center items-center relative">
          {/*cart and user  */}
          
          {user || restaurant ? (
            <div className="flex justify-center items-center gap-2">
              {user && <Link to="/cart" className="p-4 rounded-full hover:bg-gray-100">
            <IconContext.Provider value={{ size: "25px" }}>
              <CiShoppingCart />
            </IconContext.Provider>
            {user && <div className="absolute top-0 left-0 m-3 flex justify-center bg-red-800 text-white rounded-full w-4 text-xs h-4">
              {user?.cart.length}
            </div>}
          </Link>}
            <Link to={user ? "/profile": `restaurantProfile/${restaurant._id}`}>
              <img
                src={user?.avatar || restaurant?.avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
            
            </div>
          ) : (
            <div className="flex w-full justify-center items-center">
              <Link
                to="/restaurantLogin"
                className="hover:text-black text-gray-600 text-xs sm:text-lg hover:underline px-4 py-2 rounded-lg w-full"
              >
                Add Restaurant
              </Link>
              <Link
                to="/login"
                className="hover:text-black text-gray-600 text-xs sm:text-lg hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                Login
              </Link>
              
            </div>
            
          )}
        </div>
      </div>
    </header>
  );
}
