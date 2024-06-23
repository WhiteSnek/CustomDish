import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addtoCart = asyncHandler(async (req, res) => {
  const { dishId, quantity, price, address, restaurantId, ingredientId } =
    req.body;

  const cart = await Cart.create({
    dish: dishId,
    quantity,
    price,
    address,
    restaurant: restaurantId,
    customIngredients: ingredientId,
  });
  if(!cart) throw new ApiError(400,"Error adding to cart")
    res.status(201).json(new ApiResponse(200,cart, "Added to cart successfully"));
});






const removeFromCart = asyncHandler(async(req,res)=>{
    const {cartId} = req.params
    
    const cart = await Cart.findByIdAndDelete(cartId)
    if(!cart) throw new ApiError(404,"Cart not found")
        res.status(200).json(new ApiResponse(200,cart,"Removed from cart successfully"))
})

const updateCart = asyncHandler(async(req,res)=>{
    const {cartId} = req.params
    const {quantity} = req.body
    const cart = await Cart.findByIdAndUpdate(cartId,{quantity},{new:true})
    if(!cart) throw new ApiError(404,"Cart not found")
        res.status(200).json(new ApiResponse(200,cart,"Cart updated successfully"))

})

export {
    addtoCart,
    removeFromCart,
    updateCart,
}