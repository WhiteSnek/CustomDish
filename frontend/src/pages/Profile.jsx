import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

const OrderCard = ({item}) => {
    return (
        <div className='bg-gray-100 p-4 rounded-lg'>
          <div className='p-4 flex flex-col border border-gray-600 rounded-lg items-center'>
            <img src={item.dish[0].image} alt={item.dish[0].name} className='h-40 aspect-square object-cover rounded-lg' />
            <h3 className='text-lg font-semibold'>{item.dish[0].name}</h3>
            <h2 className='font-thin text-md text-gray-600'>Ordered from: <Link to={`/restaurantProfile/${item.restaurant[0]._id}`} className='underline font-medium'>{item.restaurant[0].fullname}</Link></h2>
          </div>
          <div className='flex justify-between'>
            <p className='text-md font-thin'>Quantity: {item.quantity}</p>
            <p className='text-lg font-medium'>Price: ₹ {item.price}/-</p>
          </div>
          <div className='font-thin'>
            <p>Status: {item.status}</p>
            <p>Payment type: {item.paymentType}</p>
          </div>
          <div className='flex w-full text-md font-thin'>
            <p className='w-3/4'>Deliver to: {item.address}</p>
            <button className='text-blue-600 underline w-1/4'>Change</button>
          </div>
          <button className='text-center w-full bg-red-600 text-white px-4 py-2 rounded-lg my-4'>Cancel Order</button>
        </div>
    )
}

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const [orders,setOrders] = useState([])
    useEffect(()=>{
      getOrders()
    },[])
    const getOrders = async () => {
      try {
        const response = await axios.get('/users/orders',{withCredentials: true})
        console.log(response.data.data)
        setOrders(response.data.data)
      } catch (error) {
        const errorMessage = error.response.data.match(
          /<pre>Error: (.*?)<br>/
        )[1];
        setError(errorMessage)
      }
    }
    const logoutUser = async() => {
      try {
        await axios.post('/users/logout',{},{withCredentials: true});
        window.location.href = '/';
        localStorage.removeItem('user');
        setUser(null)
      } catch(error){
        console.log(error);
      }
    }
    console.log(user)
  return (
    <div className='mx-auto w-3/4 my-10'>
      <div className='flex items-center gap-10 border-b-2 border-red-600 p-8'>
        <div>
            <img src={user?.avatar} alt='avatar' className='h-40 aspect-square rounded-full border-2 border-gray-700' />
        </div>
        <div className='relative w-3/4'>
            <h1 className='text-3xl font-semibold'>{user?.fullname}</h1>
            <h1 className='text-2xl font-thin text-gray-500'>@{user?.username}</h1>
            <h1 className='text-xl font-thin text-gray-400'>{user?.email}</h1>
            <div className='absolute top-0 right-0 flex gap-2'>
            <Link to={'/edit'} className=' bg-red-500 px-4 py-2 text-white rounded-sm'>Edit profile</Link>
            <button onClick={()=>logoutUser()} className=' bg-red-500 px-4 py-2 text-white rounded-sm'>Logout</button>
            </div>
        </div>
      </div>
      <div className='py-10'>
        <h1 className='text-3xl font-semibold pb-8'>Your orders</h1>
        <div className='grid grid-cols-4 gap-4'>
            {orders.length === 0 ? <div className='flex flex-col justify-start items-center gap-4'><p className='text-xl font-thin'>No orders found</p><button className='text-white bg-red-500 px-4 py-2 rounded-md text-lg'>Order something</button></div> : orders.map((item,idx)=>(
                <OrderCard key={idx} item={item} />
            )) }
        </div>
      </div>
    </div>
  )
}

export default Profile
