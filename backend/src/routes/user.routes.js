import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserProfile,
    getOrders,
    addOrder,
    addAddress,
    addToUserCart,
    getCart,
    removeFromCart,
    getCartLength
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/c/:username").get(verifyJWT, getUserProfile);
router.route("/orders").get(verifyJWT, getOrders);
router.route("/orders/:orderId").post(verifyJWT, addOrder);
router.route("/address").post(verifyJWT, addAddress);
router.route("/cart").post(verifyJWT, addToUserCart).get(verifyJWT, getCart)
router.route("/remove-cart/:itemId").delete(verifyJWT,removeFromCart)
router.route("/cart-length").get(verifyJWT,getCartLength)
export default router;
