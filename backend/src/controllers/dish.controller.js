import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Dish } from "../models/dish.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addDish = asyncHandler(async (req, res) => {
  const {name,description, category, price, isVeg, type} = req.body;
  if (!name || !category || !price)
    throw new ApiError(400, "Please enter all the details");
  const imageLocalPath = req.file?.path;

  // check for avatar
  if (!imageLocalPath) throw new ApiError(400, "Dish Image is required");

  // upload them to cloudinary, avatar
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) throw new ApiError(400, "Dish Image is required on cloudinary");
  const dish = await Dish.create({
    name,
    category,
    price,
    image: image.url,
    description,
    isVeg,
    type
  });

  if (!dish) throw new ApiError(400, "Error adding dish");
  res.status(200).json(new ApiResponse(200, dish, "Dish added successfully"));
});

const removeDish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Dish ID is required");
  const dish = await Dish.findByIdAndRemove(id);
  if (!dish) throw new ApiError(404, "Dish not found");
  res.status(200).json(new ApiResponse(200, null, "Dish removed successfully"));
});

const updateDish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  if (!id) throw new ApiError(400, "Dish ID is required");
  if (!name || !description || !price)
    throw new ApiError(400, "Please enter all the details");
  const dish = await Dish.findByIdAndUpdate(
    id,
    { name, description, price },
    { new: true }
  );
  if (!dish) throw new ApiError(404, "Dish not found");
  res.status(200).json(new ApiResponse(200, dish, "Dish updated successfully"));
});

const getAllDishes = asyncHandler( async(req,res)=>{
  const {query, sortBy, sortType } = req.query;
const filter = {};
if (query) {
  filter.$or = [
    { name: { $regex: query, $options: "i" } }, // Case-insensitive title search
    { category: { $regex: query, $options: "i" } }, // Case-insensitive description search
  ];
}

const sort = {};
if (sortBy) {
  sort[sortBy] = sortType === "desc" ? -1 : 1;
}

const dishes = await Dish.find(filter)
  .sort(sort)


// Send back the response
return res
  .status(200)
  .json(new ApiResponse(200, dishes, "Dishes fetched successfully"));
})

export { addDish, removeDish, updateDish, getAllDishes };
