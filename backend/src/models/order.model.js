import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
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
    paymentType: {
      type: String,
      required: true,
      enum: ['cash', 'upi', 'debit_card']
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    customIngredients: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: false
    }
  },
  { timestamps: true }
);


export const Order = mongoose.model("Order",orderSchema);