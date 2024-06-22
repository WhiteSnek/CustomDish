import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { IconContext } from "react-icons/lib";
import { CiShoppingCart } from "react-icons/ci";
import Logo from "../assets/logo.png";
import UserContext from "../context/UserContext";

export default function Header() {
  const { user,restaurant } = useContext(UserContext);
  return (
    <header className="shadow">
      <div className="flex justify-between items-center gap-10 px-10 py-2">
        <Link to="/" className="flex gap-4 justify-center items-center">
          <img src={Logo} alt="logo" className="h-14" />
          <p className="text-lg text-red-900 font-bold">Culinary.com</p>
        </Link>
        <div className="px-4 w-30">
          {/* Address of user */}
          <p>Deliver to {user?.address ? user.address : "address" }</p>
        </div>
        <div className="w-1/3 shadow">
          {/* Search bar */}
          <form className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-11/12 outline-none border-2 rounded-l-lg  border-gray-200 py-2 px-4"
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
        <div className="flex gap-2 justify-center items-center ">
          {/*cart and user  */}
          <Link to="/cart" className="p-4 rounded-full hover:bg-gray-100">
            <IconContext.Provider value={{ size: "25px" }}>
              <CiShoppingCart />
            </IconContext.Provider>
          </Link>
          {user || restaurant ? (
            <Link to={user ? "/profile": `restaurantProfile/${restaurant._id}`}>
              <img
                src={user?.avatar || restaurant?.avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            </Link>
          ) : (
            <div className="flex w-full justify-center items-center">
              <Link
                to="/restaurantLogin"
                className="hover:text-black text-gray-600 text-md hover:underline px-4 py-2 rounded-lg w-full"
              >
                Add Restaurant
              </Link>
              <Link
                to="/login"
                className="hover:text-black text-gray-600 text-lg hover:bg-gray-100 px-4 py-2 rounded-lg"
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
