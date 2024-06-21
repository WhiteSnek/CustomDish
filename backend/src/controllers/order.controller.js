import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addOrder = asyncHandler(async (req, res) => {
  const {
    dishId,
    quantity,
    price,
    paymentType,
    address,
    restaurantId,
    ingredientId,
  } = req.body;
  const order = await Order.create({
    dish: dishId,
    quantity,
    price,
    status: "placed",
    paymentType,
    address,
    restaurant: restaurantId,
    customIngredients: ingredientId,
  });
  if (!order) throw new ApiError(400, "Error creating order");
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    { new: true }
  );
  if (!order) throw new ApiError(404, "Order not found");
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: "delivered" },
    { new: true }
  );
  if (!order) throw new ApiError(404, "Order not found");
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  await Order.findByIdAndDelete(orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);
  // const order = await Order.findById(orderId).populate("restaurant").populate("customIngredients").populate("dish");
  const order = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      }
    },
    {
      $lookup: {
        from: 'dishes',
        localField: 'dish',
        foreignField: '_id',
        as: 'dish',
      }
    },{
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant',
        foreignField: '_id',
        as: 'restaurant',
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              username: 1,
              email: 1,
              avatar: 1,
              address: 1,
              rating: 1
            }
          }
        ]
      }
    },{
      $lookup: {
        from: 'ingredients',
        localField: 'customIngredients',
        foreignField: '_id',
        as: 'customIngredients',
      }
    }
  ]);
  if (!order) throw new ApiError(404, "Order not found");
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { address } = req.body;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { address },
    { new: true }
  );
  if (!order) throw new ApiError(404, "Order not found");
  return res.status(200).json(200, order, "Order updated successfully");
});

export {
  addOrder,
  cancelOrder,
  updateStatus,
  deleteOrder,
  updateOrder,
  getOrderDetails,
};
