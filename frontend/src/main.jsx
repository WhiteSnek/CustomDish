import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Home,Register,Login, Profile, RestaurantLogin, RestaurantProfile, Dishes, RegisterRestaurant} from './pages'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider.jsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER;
const Layout = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path='' element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<Profile />} />
        <Route path='restaurantLogin' element={<RestaurantLogin />} />
        <Route path='restaurantProfile/:id' element={<RestaurantProfile />} />
        <Route path='registerRestaurant' element={<RegisterRestaurant />} />
        <Route path='dishes' element={<Dishes />} />
      </Route>
    )
  )
  return (
    <UserContextProvider> 
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
)
