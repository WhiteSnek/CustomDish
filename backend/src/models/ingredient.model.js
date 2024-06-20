import mongoose, {Schema} from "mongoose";

const ingredientSchema = new Schema({
    salt:{
        type: Number
    },
    sugar:{
        type: Number
    },
    onion: {
        type: Number
    },
    garlic: {
        type: Number
    },
    chilli: {
        type: Number
    }
},{timestamps: true})

export const Ingredient = mongoose.model("Ingredient",ingredientSchema)