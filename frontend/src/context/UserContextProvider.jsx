import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import Loader from "../components/Loader";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
    if (storedRestaurant) {
      setRestaurant(storedRestaurant);
    }
    let storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    if (!user) {
      axios
        .get("/users/current-user", { withCredentials: true })
        .then((response) => {
          setUser(response.data.data);
          localStorage.setItem("user", JSON.stringify(response.data.data));
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!restaurant) {
      axios
        .get("/restaurants/current-restaurant", { withCredentials: true })
        .then((response) => {
          setRestaurant(response.data.data);
          localStorage.setItem(
            "restaurant",
            JSON.stringify(response.data.data)
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, restaurant]);

  if (loading) {
    return <Loader />; // You can replace this with a loading spinner or any other loading indicator
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle error as needed
  }

  return (
    <UserContext.Provider value={{ user, setUser, restaurant, setRestaurant }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
