import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyJWT = asyncHandler( async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) throw new ApiError(401, "Unauthorized request")
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) throw new ApiError(401, "Invalid access token")
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
})

export const verifyResJWT = asyncHandler( async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) throw new ApiError(401, "Unauthorized request")
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const restaurant = await Restaurant.findById(decodedToken?._id).select("-password -refreshToken")
        if(!restaurant) throw new ApiError(401, "Invalid access token")
        req.restaurant = restaurant;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
})