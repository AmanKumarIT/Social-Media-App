const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
    try {
        const { text, image } = req.body;

        if (!text && !image) return res.status(400).json({ error: 'Post must contain text or image' });

        const post = await Post.create({
            userId: req.user.id,
            text,
            image
        });

        const populatedPost = await Post.findById(post._id).populate('userId', 'username profilePicture');
        
        req.app.get('io').emit('postCreated', populatedPost);

        res.status(201).json(populatedPost);
    } catch (error) {
        if (error.code === 413) return res.status(413).json({ error: 'Image file too large.' });
        res.status(500).json({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'username profilePicture')
            .populate('comments.userId', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getExplorePosts = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            {
                $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } }
            },
            { $sort: { likesCount: -1, createdAt: -1 } },
            { $limit: 20 }
        ]);

        const populatedPosts = await Post.populate(posts, [
            { path: 'userId', select: 'username profilePicture' },
            { path: 'comments.userId', select: 'username profilePicture' }
        ]);

        res.status(200).json(populatedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        
        req.app.get('io').emit('postDeleted', req.params.id);

        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const userId = req.user.id;
        const index = post.likes.indexOf(userId);

        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        
        const updatedPost = await Post.findById(post._id)
            .populate('userId', 'username profilePicture')
            .populate('comments.userId', 'username profilePicture');
            
        req.app.get('io').emit('postUpdated', updatedPost);

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Comment text is required' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.comments.push({ userId: req.user.id, text });
        await post.save();
        
        const updatedPost = await Post.findById(post._id)
            .populate('userId', 'username profilePicture')
            .populate('comments.userId', 'username profilePicture');
        
        req.app.get('io').emit('postUpdated', updatedPost);

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.userId.toString() !== req.user.id && post.userId.toString() !== req.user.id) {
             return res.status(401).json({ error: 'User not authorized to delete this comment' });
        }

        comment.deleteOne();
        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('userId', 'username profilePicture')
            .populate('comments.userId', 'username profilePicture');

        req.app.get('io').emit('postUpdated', updatedPost);

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .populate('userId', 'username profilePicture')
            .populate('comments.userId', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPost, getPosts, getExplorePosts, deletePost, likePost, commentPost, deleteComment, getUserPosts };
