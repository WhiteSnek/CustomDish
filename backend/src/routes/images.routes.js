import { Router } from 'express';
import { getImages } from '../controllers/images.controller.js';
const router = Router();

router.route('/images').get(getImages)

export default router