import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addOrder = asyncHandler(async (req, res) => {
  const {
    dishId,
    quantity,
    price,
    paymentType,
    address,
    restaurantId,
    ingredientId,
  } = req.params;
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

export { addOrder, cancelOrder, updateStatus, deleteOrder, updateOrder };
