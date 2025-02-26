import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from 'nodemailer'
import { google } from 'googleapis';


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from front end
  const { fullname, email, username, password } = req.body;
  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username and email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    throw new ApiError(409, "User with email or username exists");

  // check for images
  const avatarLocalPath = req.file?.path;

  // check for avatar
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar file is required on cloudinary");

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refrest token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for usr creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body se data le aao
  const { email, username, password } = req.body;

  // username or email
  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid User credentials");

  // access and refresh token generate
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // send cookies
  const loggendInUser = await User.findById(user._id).select(
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
          user: loggendInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "User logged out"));
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

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError("Invalid Refresh Token");

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError("Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
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

const addAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;
  if (!address) throw new ApiError(400, "Address is required");
  const response = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      address,
    },
  });
  if (!response) throw new ApiError(402, "Error adding addresss");
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Address added successfully"));
});

const addToUserCart = asyncHandler(async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) throw new ApiError(400, "Cart Id is required");
  const addCart = await User.findByIdAndUpdate(req.user._id, {
    $push: {
      cart: new mongoose.Types.ObjectId(cartId),
    },
  });
  if (!addCart) throw new ApiError(400, "Error adding to cart");
  return res
    .status(200)
    .json(new ApiResponse(200, addCart, "Added to cart successfully!"));
});

const getCart = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "carts",
        localField: "cart",
        foreignField: "_id",
        as: "cart",
        pipeline: [
          {
            $lookup: {
              from: "dishes",
              localField: "dish",
              foreignField: "_id",
              as: "dish",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    isVeg: 1,
                    category: 1,
                    type: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "restaurants",
              localField: "restaurant",
              foreignField: "_id",
              as: "restaurant",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    address: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "ingredients",
        localField: "customIngredients",
        foreignField: "_id",
        as: "ingredients",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].cart, "Cart fetched successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;
  
  if (!userId || !itemId) {
    throw new ApiError(400, "User ID or Item ID not provided");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        cart: itemId,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(400, "Error removing item from cart");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Item removed from cart successfully"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, "Error while uploading the avatar");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) throw new ApiError(400, "Username is missing");
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "orders",
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const addOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const addOrder = await User.findByIdAndUpdate(req.user._id, {
    $push: {
      order: new mongoose.Types.ObjectId(orderId),
    },
  });
  if (!addOrder) throw new ApiError(400, "Error adding order");
  return res
    .status(200)
    .json(new ApiResponse(200, addOrder, "Order added successfully!"));
});

const getOrders = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
        pipeline: [
          {
            $lookup: {
              from: "dishes",
              localField: "dish",
              foreignField: "_id",
              as: "dish",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "restaurants",
              localField: "restaurant",
              foreignField: "_id",
              as: "restaurant",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    address: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].order, "Orders fetched successfully"));
});

const getCartLength = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);
  const cartLength = user.cart.length;
  return res
  .status(200)
  .json(new ApiResponse(200, cartLength, "Cart length fetched successfully"));
})





export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserProfile,
  getOrders,
  addOrder,
  addAddress,
  addToUserCart,
  getCart,
  removeFromCart,
  getCartLength,
};
