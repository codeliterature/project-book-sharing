const mongoose = require("mongoose");
const userReviewSchema = require('../models/review');
const userSchema = require('../models/user');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Calculate the average rating from an array of ratings
const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
};

// Update the user's rating in the database
const updateRating = async (userId) => {
    try {
        const ratings = await userReviewSchema.aggregate([
            { $match: { reviewedUser: new mongoose.Types.ObjectId(userId) } },
            { $project: { rating: 1 } }
        ]);

        const ratingArr = ratings.map(review => review.rating);
        const averageRating = calculateAverageRating(ratingArr);
        
        await userSchema.findByIdAndUpdate(userId, { rating: averageRating });
        return averageRating;
    } catch (error) {
        console.error("Error updating user rating:", error);
        throw new Error("Internal Server Error");
    }
};

// Handle user reviews
const createReview = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: targetId } = req.params;
        const { rating, comment } = req.body;
        const user = await userSchema.findById(userId);
        const targetUser = await userSchema.findById(targetId);
        if (!user || !targetUser) return res.status(400).json({ message: "Invalid User Id" });
        if (!rating || !comment) return res.status(400).json({ message: "All fields are required." });

        const newReview = new userReviewSchema({
            reviewer: userId,
            reviewedUser: targetId,
            rating,
            comment
        });

        await newReview.save();
        await targetUser.updateOne({ $addToSet: { reviews: newReview._id } });
        await updateRating(targetId);

        res.status(200).json({ message: "User Reviewed Successfully.", reviewId: newReview._id });
    } catch (error) {
        console.error("Error reviewing user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Handle review deletion
const deleteReview = async (req, res) => {
    try {
        const { id: reviewId } = req.params;
        const { id: userId } = req.user;

        const review = await userReviewSchema.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });
        if (userId !== review.reviewer.toString()) return res.status(403).json({ message: "User not authorized to delete this review" });

        const targetId = review.reviewedUser.toString();
        const targetUser = await userSchema.findById(targetId);
        await userReviewSchema.findByIdAndDelete(reviewId);
        await targetUser.updateOne({ $pull: { reviews: reviewId } });
        await updateRating(targetId);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch reviews for a specific user
const getReviews = async (req, res) => {
    try {
        const { id: targetId } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const userReviews = await userReviewSchema.aggregate([
            { $match: { reviewedUser: new mongoose.Types.ObjectId(targetId) } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewer',
                    foreignField: '_id',
                    as: 'reviewerDetails'
                }
            },
            { $unwind: '$reviewerDetails' },
            {
                $project: {
                    rating: 1,
                    comment: 1,
                    'reviewerDetails.username': 1,
                    'reviewerDetails.profilePicture': 1
                }
            }
        ]);

        res.status(200).json(userReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { createReview, getReviews, deleteReview };