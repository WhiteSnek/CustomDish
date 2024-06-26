import { Router } from "express";
import { addOrder, cancelOrder, updateStatus, deleteOrder, updateOrder,getOrderDetails } from '../controllers/order.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route('/').post(addOrder)
router.route('/:orderId').get(getOrderDetails).patch(updateOrder).delete(deleteOrder)
router.route('/status/:orderId').patch(cancelOrder)
router.route('/update-status/:id').patch(updateStatus) //TODO:

export default router