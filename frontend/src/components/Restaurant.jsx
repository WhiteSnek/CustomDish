import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { GrPrevious, GrNext } from "react-icons/gr";
import ReactPaginate from 'react-paginate';
import UserContext from '../context/UserContext';



const RestaurantCard = ({item}) => {
    return (
        <Link to={`/restaurantProfile/${item._id}`} className='bg-gray-100 p-8 rounded-lg hover:shadow-xl'>
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
        </Link>
    )
}

const Restaurant = () => {
    const [restaurants, setRestaurants] = useState([])
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;
    const {search} = useContext(UserContext)
    useEffect(()=>{
        getRestaurants()
    },[search])
    const getRestaurants = async () => {
        const response = await axios.get('/restaurant/restaurants',{
            params: {
                query: search
            }
        },{withCredentials: true})
        setRestaurants(response.data.data)
    }
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = restaurants.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(restaurants.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage;
        setItemOffset(newOffset);
    };
  return (
    <div className='p-8'>
      <h1 className='text-4xl font-bold px-4 pb-10'>Best Restaurants in Delhi</h1>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-12'>
        {currentItems.map((item,idx)=>(
            <RestaurantCard key={idx} item={item} />
        ))}
    </div>
    <div className="flex justify-center mt-6">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={<GrNext />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel={<GrPrevious />}
                    renderOnZeroPageCount={null}
                    pageLinkClassName="bg-gray-100 py-2 px-4 rounded-md"
                    previousClassName="bg-gray-100 py-2 px-2 rounded-md"
                    nextClassName="bg-gray-100 py-2 px-2 rounded-md"
                    activeLinkClassName="border-2 border-gray-500 bg-gray-300"
                    className="flex gap-4 justify-center items-center"
                />
            </div>
    </div>
  )
}

export default Restaurant
