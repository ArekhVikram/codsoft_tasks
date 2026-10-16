import express from 'express';
import { getProducts, getProductById, getCategories, getFeaturedProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

export default router;
