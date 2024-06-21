import { Router } from "express";
import {
    registerRestaurant,
  loginRestaurant,
  logoutRestaurant,
  refreshAccessToken,
  updateRestaurantAddresss,
  getCurrentRestaurant,
  addDishes,
  getAllDishes,
  getAllRestaurants,
  addRating,
  getRestaurantById
} from '../controllers/restaurant.controller.js'

const router = Router();

import { upload } from "../middlewares/multer.middleware.js";
import { verifyResJWT } from "../middlewares/auth.middleware.js";
router.route("/register").post(upload.single("avatar"), registerRestaurant);

router.route("/login").post(loginRestaurant);
router.route("/logout").post(verifyResJWT, logoutRestaurant);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-address").patch(verifyResJWT, updateRestaurantAddresss)
router.route("current-restaurant").get(getCurrentRestaurant)
router.route("/dishes").post(verifyResJWT, addDishes)
router.route("/dishes/:id").get(getAllDishes)
router.route("/restaurants").get(getAllRestaurants)
router.route("/:id").get(getRestaurantById)
router.route("/rating").post(addRating)

export default router;
