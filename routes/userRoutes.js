const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleFollow, getUserById, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/:id/follow', protect, toggleFollow);
router.get('/:id', protect, getUserById);

module.exports = router;
