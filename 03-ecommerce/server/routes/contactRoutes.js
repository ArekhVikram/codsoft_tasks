import express from 'express';
import { subscribeNewsletter, submitContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/newsletter', subscribeNewsletter);
router.post('/', submitContact);

export default router;
