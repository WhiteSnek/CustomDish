import { Router } from "express";
import { addOrder, cancelOrder, updateStatus, deleteOrder, updateOrder,getOrderDetails } from '../controllers/order.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route('/').post(addOrder)
router.route('/:orderId').get(getOrderDetails).patch(updateOrder).delete(deleteOrder) //TODO:
router.route('/status/:id').patch(cancelOrder) //TODO:
router.route('/update-status/:id').patch(updateStatus) //TODO:

export default router