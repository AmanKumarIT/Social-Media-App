const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
            .populate('followers', 'username')
            .populate('following', 'username');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture, username } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bio !== undefined) user.bio = bio;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (username !== undefined) user.username = username;

        await user.save();
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers,
            following: user.following
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userToFollow.id === currentUser.id) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        const isFollowing = currentUser.following.includes(userToFollow.id);

        if (isFollowing) {
            currentUser.following.pull(userToFollow.id);
            userToFollow.followers.pull(currentUser.id);
        } else {
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);
        }

        await currentUser.save();
        await userToFollow.save();
        
        req.app.get('io').emit('userFollowUpdated', { userId: userToFollow.id, followersCount: userToFollow.followers.length });

        res.json(currentUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
             return res.status(400).json({ error: "Query parameter 'q' is required" });
        }
        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }).select('username profilePicture followers bio');
        res.json(users);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getProfile, updateProfile, toggleFollow, getUserById, searchUsers };
