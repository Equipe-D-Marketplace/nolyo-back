import { registeruser,loginuser,getalluser,getuserbyid,edituser,deleteuser } from '../controllers/auth.controller.js';
import express from 'express';
const router = express.Router();


router.post('/register', registeruser);
router.post('/login',loginuser)
router.get('/get/all/users',getalluser)
router.get('/profile/id',getuserbyid)
router.patch('/profile/edit/id',edituser)
router.delete('/profile/delete',deleteuser)

// POST | /api/profile/add | Créer un profil secondaire | authMiddleware
// GET | /api/profile | Voir ses profils | authMiddleware
// PUT | /api/profile/edit/:id | Modifier un profil | authMiddleware
// DELETE | /api/profile/delete/:id | Supprimer un profil | authMiddleware


export default router;