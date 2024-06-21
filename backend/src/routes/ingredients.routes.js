import { Router } from "express";
import { addIngredients } from '../controllers/ingredient.controller.js'

const router = Router()

router.route('/').post(addIngredients)

export default router