import { registeruser,loginuser,getalluser,getuserbyid,edituser,deleteuser } from '../controllers/auth.controller.js';
import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/all.middleware.js';


router.post('/register', registeruser);
router.post('/login',loginuser)
router.get('/get/all/users',authMiddleware,getalluser)
router.get('/profile/id',authMiddleware,getuserbyid)
router.patch('/profile/edit/id',authMiddleware,edituser)
router.delete('/profile/delete',authMiddleware,deleteuser)



export default router;