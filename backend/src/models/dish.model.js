import mongoose, {Schema} from "mongoose";

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    type:{
        type: String,
        required: true,
        enum: ['spicy','sweet']
    },
    isVeg: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: true
    }
},{timestamps: true})

export const Dish = mongoose.model("Dish",dishSchema)