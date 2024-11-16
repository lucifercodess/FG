import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import upload from '../middlewares/multer.js';
import { bookmarkPost, commentPost, createPost, deletePost, getAllPosts, getCommentsOnAPost, getPostBySpecificUser, likeUnlikePost } from '../controllers/post.controller.js';

const router = express.Router();


router.post('/create',protectRoute,upload.single('image'),createPost);
router.get('/all-posts',protectRoute,getAllPosts);
router.get('/getAllByUser',protectRoute,getPostBySpecificUser);
router.patch('/like-unlike/:id',protectRoute,likeUnlikePost);
router.post('/add-comment/:id',protectRoute,commentPost);
router.get('/get-comments/:id',protectRoute,getCommentsOnAPost);
router.delete("/delete/:id",protectRoute,deletePost);
router.post('/bookmark/:id',protectRoute,bookmarkPost);


export default router;