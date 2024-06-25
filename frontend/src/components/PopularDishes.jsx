import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { GrPrevious, GrNext } from "react-icons/gr";
import ReactPaginate from 'react-paginate';

const DishesCard = ({ item }) => {
    return (
        <Link to={`/dish/${item._id}`} className="flex flex-col justify-center items-center transition-all bg-gray-100 p-4 rounded-lg hover:scale-105">
            <img src={item.image} alt={item.name} className='h-28 sm:h-40 aspect-square object-cover rounded-lg' />
            <h2 className='text-lg font-semibold'>{item.name}</h2>
            <div className='flex gap-1 sm:gap-2 text-[10px] sm:text-xs'>
                <span className='bg-blue-600 text-white px-2 py rounded-full'>{item.category}</span>
                <span className={`${item.type === "spicy" ? "bg-red-400" : "bg-yellow-400"} text-white px-2 py rounded-full`}>{item.type}</span>
                <span className={`${item.isVeg ? "bg-green-500" : "bg-red-500"} text-white px-2 py rounded-full`}>{item.isVeg ? "Veg" : "Non-veg"}</span>
            </div>
        </Link>
    );
};

const PopularDishes = () => {
    const [recipes, setRecipes] = useState([]);
    const { category, search } = useContext(UserContext);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 12;

    useEffect(() => {
        getAllDishes();
    }, [category, search]);

    useEffect(() => {
        setItemOffset(0);  // Reset to the first page whenever category or search changes
    }, [category, search]);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = recipes.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(recipes.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage;
        setItemOffset(newOffset);
    };

    const getAllDishes = async () => {
        try {
            const response = await axios.get('/dish/all', {
                params: {
                    query: category === 'all' ? search : category,
                },
                withCredentials: true
            });
            setRecipes(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold pb-10">Popular Dishes</h1>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6">
                {recipes.length === 0 ? (
                    <p className="text-lg p-4">No Dishes found</p>
                ) : (
                    currentItems.map((item, idx) => (
                        <DishesCard key={idx} item={item} />
                    ))
                )}
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
    );
};

export default PopularDishes;
