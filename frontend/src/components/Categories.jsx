import React, { useContext, useEffect,useState } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png'; 
import { Link } from 'react-router-dom';
import { data } from '../constants';
import axios from 'axios'



const LeftArrow = () => {
    const { scrollPrev } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollPrev()} className="left-arrow">
            <img src={LeftArrowIcon} alt="left-arrow" />
        </div>
    );
};

const RightArrow = () => {
    const { scrollNext } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollNext()} className="right-arrow">
            <img src={RightArrowIcon} alt="right-arrow" />
        </div>
    );
};

const CategoryCard = ({ item }) => {
    const [image, setImage] = useState(item.image);

    useEffect(() => {
        const getImages = async () => {
            try {
                const response = await axios.get('https://api.pexels.com/v1/search', {
                    headers: {
                        'Authorization': import.meta.env.VITE_PEXELS_KEY
                    },
                    params: {
                        query: item.name + 'cuisine',
                        per_page: 1 
                    }
                });
                console.log(response.data.photos[0]?.src.original)
                setImage(response.data.photos[0]?.src.original); // Update the image state with the response data
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        getImages();
    }, [item.name]); // Add item.name as a dependency

    return (
        <Link to={`/${item.name.toLowerCase()}`} className="flex flex-col justify-center items-center bg-gray-100 p-4 rounded-lg">
            <img src={image} alt='logo' className='h-40 aspect-square object-cover rounded-lg' />
            <h2 className='text-lg font-semibold'>{item.name}</h2>
        </Link>
    );
};

const Categories = () => {
    
    return (
        <div className='p-4'>
            <h1 className='text-4xl font-bold px-4 pb-10'>Cuisines</h1>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {data.map((item, index) => (
                <div
                    key={index}
                    itemId={item}
                    title={item}
                    className="category-item"
                >
                    <CategoryCard item={item} />
                </div>
            ))}
        </ScrollMenu>
        </div>
    );
};

export default Categories;
