import { Router } from "express";
import { addtoCart,removeFromCart,updateCart } from "../controllers/cart.controller.js";
const router = Router();
router.post('/add', addtoCart);
router.delete('/remove/:cartId', removeFromCart);
router.patch('/update/:cartId', updateCart);


export default router