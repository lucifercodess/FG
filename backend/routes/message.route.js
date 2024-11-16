import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();


router.post('/send/:id',protectRoute,sendMessage)
router.get('/get/:id',protectRoute,getMessage)

export default router;