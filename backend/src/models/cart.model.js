import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema({
    dish: {
        type: Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      address: {
        type: String,
        required: true,
      },
      customIngredients: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: false
      }
},{timestamps: true})

export const Cart = mongoose.model("Cart",cartSchema)