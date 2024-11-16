import express from 'express';
import { editProfile, followOrUnfollow, getProfileById, getSuggestedUsers, login, logout, register } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import upload from '../middlewares/multer.js';

const router = express.Router();


router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/profile/:id',protectRoute,getProfileById);
router.put('/edit',upload.single('profilePic'),protectRoute,editProfile);
router.post('/follow-unfollow/:id',protectRoute,followOrUnfollow);
router.get('/get-suggested-users',protectRoute,getSuggestedUsers);




export default router;
