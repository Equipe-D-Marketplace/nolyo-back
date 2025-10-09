import { registeruser,loginuser } from '../controllers/auth.controller.js';
import express from 'express';
const router = express.Router();


router.post('/register', registeruser);
router.post('/login',loginuser)

export default router;