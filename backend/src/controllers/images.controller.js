import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const getImages = asyncHandler( async(req,res)=>{
    try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            headers: {
                'Authorization': '5q2xUWFPpBpAvvwCWTA07Yt5D93TVe9ehF7Wq9MyKZeTCGeAtUqWDgLO'
            },
            params: req.query
        });
        console.log('hello')
        res.json(new ApiResponse(200,response,"Images fetched successfully"));
    } catch (error) {
        throw new ApiError(500,"Error fetching images")
    }
})

export {
    getImages
}