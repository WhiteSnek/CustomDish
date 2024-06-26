import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import Loader from "../components/Loader";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
    if (storedRestaurant) {
      setRestaurant(storedRestaurant);
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    
    const fetchCurrentUser = async () => {
      try {
        await axios.get('/users/current-user', { withCredentials: true });
      } catch (error) {
        refreshUserToken()
        localStorage.removeItem("user");
        setError('Failed to fetch current user');
      }
    };

    const refreshUserToken = async () => {
      try {
        await axios.post('/users/refresh-token',{withCredentials: true});
      } catch (error) {
        console.log(error)
      }
    }

    const refreshRestaurantToken = async () => {
      try {
        await axios.post('/restaurant/refresh-token',{withCredentials: true});
      } catch (error) {
        console.log(error)
      }
    }

    const fetchCurrentRestaurant = async () => {
      try {
        await axios.get('/restaurant/current-restaurant', { withCredentials: true });
      } catch (error) {
        refreshRestaurantToken()
        localStorage.removeItem("restaurant");
        setError('Failed to fetch current restaurant');
      }
    };

    Promise.all([fetchCurrentUser(), fetchCurrentRestaurant()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ user, setUser, restaurant, setRestaurant, category, setCategory, search, setSearch, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
