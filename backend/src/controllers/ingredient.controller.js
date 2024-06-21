import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Ingredient } from "../models/ingredient.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addIngredients = asyncHandler( async(req,res) => {
    const { salt,sugar,onion,garlic,chilli } = req.body;
    const ingredient = await Ingredient.create({ salt,sugar,onion,garlic,chilli });
    if(!ingredient) throw new ApiError(400,"Error adding ingredients")
        return res.status(200).json(new ApiResponse(200,ingredient,"Ingredients added successfully"))
})

export {
    addIngredients
}