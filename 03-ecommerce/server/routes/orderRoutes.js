import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order creation can be guest or authenticated (optionalAuth records user id if token present)
router.post('/', optionalAuth, createOrder);

// Order history requires authentication
router.get('/', protect, getMyOrders);

// Single order by ID (optional auth to verify ownership if user)
router.get('/:id', optionalAuth, getOrderById);

export default router;
