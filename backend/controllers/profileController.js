const userSchema = require('../models/user');
const mongoose = require('mongoose');

// Fetch user profile details
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userSchema.findById(userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// fetch profile details of other users
const getUser = async (req, res) => {
    try {
        userId = req.params.id;
        const user = await userSchema.findById(userId).select("-password -email -notifications");
        res.status(200).json(user);
    } catch (error) {
        console.log("error, something occured", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

const getSearchUsers = async (req, res) => {
    const { username, page = 1, limit = 10 } = req.query;
    try {
        // Build query
        const query = {};
        if (username) query.username = new RegExp(username, 'i');

        // Retrieve books with pagination
        const users = await userSchema.find(query).select("-password -email -notifications -books -followers -following -reviews -createdAt -updatedAt")
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();

        // Get total documents count for pagination
        const count = await userSchema.countDocuments(query);

        res.status(200).json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    const { username, bio, birthday, gender, profilePicture, location } = req.body;
    try {
        const userId = req.user.id;
        const updateFields = { username, bio, birthday, gender, profilePicture, location };

        const updatedUser = await userSchema.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Follow/Unfollow functionality
const updateFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        const followerId = req.params.id;

        // Ensure user and follower exist
        const user = await userSchema.findById(userId);
        const follower = await userSchema.findById(followerId);

        if (!user || !follower) {
            return res.status(404).json({ message: 'User or follower not found' });
        }

        if (userId === followerId) {
            return res.status(403).json({ message: 'Cannot follow/unfollow yourself' });
        }

        if (user.following.includes(followerId)) {
            // Unfollow
            await user.updateOne({ $pull: { following: followerId } });
            await follower.updateOne({ $pull: { followers: userId } });
            return res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            // Follow
            await user.updateOne({ $addToSet: { following: followerId } });
            await follower.updateOne({ $addToSet: { followers: userId } });
            return res.status(200).json({ message: 'User followed successfully' });
        }
    } catch (error) {
        console.error('Error updating following:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get followers list
const getFollowers = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const user = await userSchema.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $project: { followers: 1 } },
            { $unwind: '$followers' },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'followers',
                    foreignField: '_id',
                    as: 'followerDetails'
                }
            },
            { $unwind: '$followerDetails' },
            {
                $project: {
                    'followerDetails.username': 1,
                    'followerDetails.profilePicture': 1,
                    'followerDetails.bio': 1,
                    'followerDetails.location': 1
                }
            }
        ]);

        res.status(200).json(user.map(f => f.followerDetails));
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get following list
const getFollowing = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const user = await userSchema.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $project: { following: 1 } },
            { $unwind: '$following' },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'followingDetails'
                }
            },
            { $unwind: '$followingDetails' },
            {
                $project: {
                    'followingDetails.username': 1,
                    'followingDetails.profilePicture': 1,
                    'followingDetails.bio': 1,
                    'followingDetails.location': 1
                }
            }
        ]);

        res.status(200).json(user.map(f => f.followingDetails));
    } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getUserProfile, getUser, getSearchUsers, updateUserProfile, updateFollowing, getFollowers, getFollowing };
