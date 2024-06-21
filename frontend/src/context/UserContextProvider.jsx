import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import Loader from "../components/Loader";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
    if (storedRestaurant) {
      setRestaurant(storedRestaurant);
    }
    axios.get('/user/current-user',{withCredentials:true}).catch((error)=>{
      localStorage.removeItem("user")
    })
    axios.get('/restaurant/current-restaurant',{withCredentials:true}).catch((error)=>{
      localStorage.removeItem("restaurant")
    })
    let storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser, restaurant, setRestaurant }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
