import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

const DishCard = ({item}) => {
    return (
      <div
      className={`flex flex-col gap-4 p-4 m-2 border-2 ${
        item.isVeg ? "border-green-500" : "border-red-500"
      } rounded-lg w-full hover:shadow-lg h-full hover:scale-105 transition-all`}
    >
      <div className="flex justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-full aspect-square rounded-lg object-cover "
        />
      </div>
      <div className=''>
        <h2 className="text-2xl font-semibold">{item.name}</h2>
        <div className='flex gap-2 text-sm'><span className='bg-blue-600 text-white px-2 py rounded-full'>{item.category}</span><span  className={`${
                item.type == "spicy" ? "bg-red-400" : "bg-yellow-400"
              } text-white px-2 py rounded-full`}>{item.type}</span></div>
              <div className='text-sm font-thin text-gray-500 h-20 overflow-hidden'>
        <p>{item.description}</p></div>
      </div>
      <h1 className='text-lg font-thin'>Rs {item.price} /-</h1>
    </div>
    )
}

const RestaurantProfile = () => {
    const { restaurant, setRestaurant } = useContext(UserContext);
    const {id} = useParams()
    const [rest,setRest] = useState(null)
    const [dishes,setDishes] = useState([])
    useEffect(()=>{
      getRestaurant();
    },[dishes])
    const logoutUser = async() => {
      try {
        await axios.post('/restaurant/logout',{},{withCredentials: true});
        window.location.href = '/';
        setRestaurant(null)
        localStorage.removeItem('restaurant');
      } catch(error){
        console.log(error);
      }
    }
    const getRestaurant = async() => {
      try {
        const response = await axios.get(`/restaurant/${id}`,{withCredentials: true})

        setRest(response.data.data)
        setDishes(response.data.data.dishes)
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='mx-auto w-3/4 my-10'>
      <div className='flex flex-col sm:flex-row justify-center sm:items-center gap-10 border-b-2 border-red-600 p-8'>
        <div>
            <img src={rest?.avatar} alt='avatar' className='h-40 aspect-square rounded-full border-2 border-gray-700' />
        </div>
        <div className='relative w-full sm:w-3/4'>
            <h1 className='text-lg sm:text-3xl font-semibold'>{rest?.fullname}</h1>
            <h1 className='text-md sm:text-2xl font-thin text-gray-400'>{rest?.email}</h1>
            <h1 className='text-sm sm:text-xl font-thin text-gray-400'>{rest?.address}</h1>
            {(id == restaurant?._id) && <div className='absolute top-0 -right-10 sm:right-0 flex flex-col sm:flex-row gap-2'>
            <button className=' bg-red-500 px-2 sm:px-4 py-2 text-white text-sm sm:text-md rounded-sm'>Edit profile</button>
            <button onClick={()=>logoutUser()} className=' bg-red-500 px-2 sm:px-4 py-2 text-sm sm:text-md text-white rounded-sm'>Logout</button>
            </div>}
        </div>
      </div>
      <div className='py-10'>
        <h1 className='text-3xl font-semibold'>Available Dishes</h1>
        <div className='grid grid-cols-1 sm:grid-cols-4 max-h-max gap-3 justify-center items-center py-4'>
            {dishes.length === 0 ? <div className='flex flex-col justify-start items-center gap-4'><p className='text-xl font-thin'>No dishes found</p></div> : dishes.map((item,idx)=>(
                <DishCard key={idx} item={item} />
            )) }
            
        </div>
        {(id == restaurant?._id) && <div className="fixed bottom-0 right-0 px-10 py-4 w-full flex justify-end shadow-lg bg-slate-100"><Link to="/dishes" className='text-white bg-red-500 px-4 py-2 rounded-md text-lg'>Add dishes</Link></div>}
        
      </div>
    </div>
  )
}

export default RestaurantProfile
