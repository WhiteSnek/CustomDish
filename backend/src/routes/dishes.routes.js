import { Router } from "express";
import {
    addDish, removeDish, updateDish, getAllDishes,
    getDishById
} from '../controllers/dish.controller.js'
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/add").post(upload.single("image"),addDish);
router.route("/remove/:id").delete(removeDish);
router.route("/update/:id").patch(updateDish);
router.route("/all").get(getAllDishes)
router.route("/:id").get(getDishById)

export default router