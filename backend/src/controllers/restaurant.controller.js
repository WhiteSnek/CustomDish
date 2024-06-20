import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Dish } from "../models/dish.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const getAllRestaurants = asyncHandler( async(req,res)=>{
    const {query, sortBy, sortType } = req.query;
  const filter = {};
  if (query) {
    filter.$or = [
      { fullname: { $regex: query, $options: "i" } }, // Case-insensitive title search
      { address: { $regex: query, $options: "i" } }, // Case-insensitive description search
    ];
  }

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortType === "desc" ? -1 : 1;
  }

  const restaurants = await Restaurant.find(filter)
    .sort(sort)


  // Send back the response
  return res
    .status(200)
    .json(new ApiResponse(200, restaurants, "Restaurants fetched successfully"));
})

const addRating = asyncHandler( async(req,res)=>{
  const { rating, restaurantId } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
    $set: {
      rating: rating,
    }}, { new: true });
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, newRating, "Rating added successfully"));
})

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const restaurant = await Restaurant.findById(userId);
    const accessToken = restaurant.generateAccessToken();
    const refreshToken = restaurant.generateRefreshToken();

    restaurant.refreshToken = refreshToken;
    await restaurant.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerRestaurant = asyncHandler(async (req, res) => {
  // get restaurant details from front end
  const { fullname, email, username, password, address } = req.body;
  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if restaurant already exists: username and email
  const existedRestaurant = await Restaurant.findOne({
    $or: [{ username }, { email }],
  });
  if (existedRestaurant)
    throw new ApiError(409, "Restaurant with email or username exists");

  // check for images
  const avatarLocalPath = req.file?.path;

  // check for avatar
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar file is required on cloudinary");

  // create restaurant object - create entry in db
  const restaurant = await Restaurant.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    address,
    username: username.toLowerCase(),
  });

  // remove password and refrest token field from response
  const createdRestaurant = await Restaurant.findById(restaurant._id).select(
    "-password -refreshToken"
  );

  // check for usr creation
  if (!createdRestaurant) {
    throw new ApiError(
      500,
      "Something went wrong while registering the restaurant"
    );
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdRestaurant,
        "Restaurant registered successfully"
      )
    );
});

const loginRestaurant = asyncHandler(async (req, res) => {
  // req body se data le aao
  const { email, username, password } = req.body;

  // username or email
  if (!username) {
    throw new ApiError(400, "Username or Email is required");
  }

  // find the restaurant
  const restaurant = await Restaurant.findOne({
    $or: [{ username }, { email }],
  });
  if (!restaurant) {
    throw new ApiError(401, "restaurant does not exist");
  }

  // password check
  const isPasswordValid = await restaurant.isPasswordCorrect(password);
  if (!isPasswordValid)
    throw new ApiError(401, "Invalid restaurant credentials");

  // access and refresh token generate
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    restaurant._id
  );

  // send cookies
  const loggendInRestaurant = await Restaurant.findById(restaurant._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          restaurant: loggendInRestaurant,
          accessToken,
          refreshToken,
        },
        "restaurant logged in successfully"
      )
    );
});

const logoutRestaurant = asyncHandler(async (req, res) => {
  await Restaurant.findByIdAndUpdate(
    req.restaurant._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "restaurant logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const restaurant = await Restaurant.findById(decodedToken?._id);
    if (!restaurant) throw new ApiError("Invalid Refresh Token");

    if (incomingRefreshToken !== restaurant?.refreshToken) {
      throw new ApiError("Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(restaurant._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const updateRestaurantAddresss = asyncHandler(async (req, res) => {
  const { address } = req.body;
  const restaurantId = req.params.id;
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      address,
    },
    { new: true }
  );
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant address updated"));
});

const getCurrentRestaurant = asyncHandler( async(req,res) =>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.restaurant, "Current restaurant fetched successfully"))
})

const addDishes = asyncHandler( async(req,res)=>{
    const {dishId} = req.body
    console.log(dishId)
    if(!dishId) throw new ApiError(400,"Dish does not exist")
    const restaurant = await Restaurant.findByIdAndUpdate(
        req.restaurant._id,
        {
            $push: {dishes: dishId}
            },
            {new: true}
            )
            if(!restaurant){
                throw new ApiError(404, "Restaurant not found")
                }
                return res
                .status(200)
                .json(new ApiResponse(200, restaurant, "Dish added successfully"))
})

const getAllDishes = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  // Using aggregation to fetch the restaurant with its dishes
  const restaurant = await Restaurant.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(restaurantId), // Convert string to ObjectId
      },
    },
    {
      $lookup: {
        from: "dishes",
        localField: "dishes",
        foreignField: "_id",
        as: "dishes",
      },
    },
  ]);

  // Check if restaurant was found
  if (restaurant.length === 0) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Extract dishes array from the restaurant object
  const restaurantDishes = restaurant[0].dishes;

  // Fetch dishes from Dish collection using $in operator
  const dishes = await Dish.find({ _id: { $in: restaurantDishes } });

  // Return response
  return res
    .status(200)
    .json(new ApiResponse(200, dishes, "Dishes fetched successfully"));
});

export default getAllDishes;

export {
  registerRestaurant,
  loginRestaurant,
  logoutRestaurant,
  refreshAccessToken,
  updateRestaurantAddresss,
  getCurrentRestaurant,
  addDishes,
  getAllDishes,
  getAllRestaurants,
  addRating
};
