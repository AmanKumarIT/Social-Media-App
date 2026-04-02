const express = require('express');
const router = express.Router();
const { createPost, getPosts, getExplorePosts, deletePost, likePost, commentPost, deleteComment, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.get('/explore', getExplorePosts);
router.get('/user/:userId', getUserPosts);
router.route('/:id').delete(protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:postId/comment/:commentId', protect, deleteComment);

module.exports = router;
