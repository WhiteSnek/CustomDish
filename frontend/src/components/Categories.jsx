import React, { useContext, useEffect, useState } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png'; 
import axios from 'axios';
import UserContext from '../context/UserContext';
import {data} from '../constants'
import "react-horizontal-scrolling-menu/dist/styles.css"; // Ensure you import the default styles

const LeftArrow = () => {
    const { scrollPrev } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollPrev()} className="left-arrow cursor-pointer p-2">
            <img src={LeftArrowIcon} alt="left-arrow" className="w-6 h-6" />
        </div>
    );
};

const RightArrow = () => {
    const { scrollNext } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollNext()} className="right-arrow cursor-pointer p-2">
            <img src={RightArrowIcon} alt="right-arrow" className="w-6 h-6" />
        </div>
    );
};

const CategoryCard = ({ item, setCategory }) => {
    const [image, setImage] = useState(item.image);

    useEffect(() => {
        const getImages = async () => {
            try {
                const response = await axios.get('https://api.pexels.com/v1/search', {
                    headers: {
                        'Authorization': import.meta.env.VITE_PEXELS_KEY
                    },
                    params: {
                        query: item.name + ' cuisine',
                        per_page: 1 
                    }
                });
                setImage(response.data.photos[0]?.src.original); // Update the image state with the response data
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        getImages();
    }, [item.name]); // Add item.name as a dependency

    return (
        <button onClick={() => setCategory(item.name)} className="flex flex-col justify-center items-center bg-gray-100 p-4 rounded-lg">
            <img src={image} alt={item.name} className='h-40 aspect-square object-cover rounded-lg' />
            <h2 className='text-lg font-semibold'>{item.name}</h2>
        </button>
    );
};

const Categories = () => {
    const { category, setCategory } = useContext(UserContext);
    
    return (
        <div className='p-4'>
            <h1 className='text-4xl font-bold px-4 pb-10'>Cuisines</h1>
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} className="flex items-center">
                {data.map((item, index) => (
                    <div
                        key={index}
                        itemId={item.name} // Ensure unique ID for each item
                        title={item.name}
                        className="category-item"
                    >
                        <CategoryCard item={item} setCategory={setCategory} />
                    </div>
                ))}
            </ScrollMenu>
        </div>
    );
};

export default Categories;
