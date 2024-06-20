import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios'




const RestaurantCard = ({item}) => {
    return (
        <div className='bg-gray-100 p-8 rounded-lg hover:shadow-xl'>
            <div className='flex justify-center mb-4'>
                <img src={item.avatar} alt='logo' className='w-80 aspect-square object-cover rounded-lg' />
            </div>
            <div className='text-lg'>
                <div className='flex justify-between '>
                    <h2>{item.fullname}</h2>
                    <span className='bg-green-800 text-white px-2 py-1 rounded-lg'>{item.rating}</span>
                </div>
                <div className=' text-gray-600 font-thin'>
                    <p className='text-sm'>{item.username}</p>
                    <h3>{item.email}</h3>
                    
                </div>
                <div className='font-thin text-gray-500'>{item.address}</div>
            </div>
        </div>
    )
}

const Restaurant = () => {
    const [restaurants, setRestaurants] = useState([])
    useEffect(()=>{
        getRestaurants()
    },[])
    const getRestaurants = async () => {
        const response = await axios.get('/restaurant/restaurants',{withCredentials: true})
        setRestaurants(response.data.data)
    }
  return (
    <div className='p-8'>
      <h1 className='text-4xl font-bold px-4 pb-10'>Best Restaurants in Delhi</h1>
    <div className='grid grid-cols-3 gap-12'>
        {restaurants.map((item,idx)=>(
            <RestaurantCard key={idx} item={item} />
        ))}
    </div>
    </div>
  )
}

export default Restaurant
