import React, {useContext} from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'

const OrderCard = ({item}) => {
    return (
        <></>
    )
}

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const logoutUser = async() => {
      try {
        await axios.post('/users/logout',{},{withCredentials: true});
        window.location.href = '/';
        setUser(null)
      } catch(error){
        console.log(error);
      }
    }
  return (
    <div className='mx-auto w-3/4 my-10'>
      <div className='flex items-center gap-10 border-b-2 border-red-600 p-8'>
        <div>
            <img src={user.avatar} alt='avatar' className='h-40 aspect-square rounded-full border-2 border-gray-700' />
        </div>
        <div className='relative w-3/4'>
            <h1 className='text-3xl font-semibold'>{user.fullname}</h1>
            <h1 className='text-2xl font-thin text-gray-500'>@{user.username}</h1>
            <h1 className='text-xl font-thin text-gray-400'>{user.email}</h1>
            <div className='absolute top-0 right-0 flex gap-2'>
            <button className=' bg-red-500 px-4 py-2 text-white rounded-sm'>Edit profile</button>
            <button onClick={()=>logoutUser()} className=' bg-red-500 px-4 py-2 text-white rounded-sm'>Logout</button>
            </div>
        </div>
      </div>
      <div className='py-10'>
        <h1 className='text-3xl font-semibold'>Your orders</h1>
        <div className='flex justify-center items-center'>
            {user.order.length === 0 ? <div className='flex flex-col justify-start items-center gap-4'><p className='text-xl font-thin'>No orders found</p><button className='text-white bg-red-500 px-4 py-2 rounded-md text-lg'>Order something</button></div> : user.order.map((item,idx)=>(
                <OrderCard key={idx} item={item} />
            )) }
        </div>
      </div>
    </div>
  )
}

export default Profile
