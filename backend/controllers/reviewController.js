const express = require("express");
const mongoose = require("mongoose");
const userReviewSchema = require('../models/review');
const userSchema = require('../models/user');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((accumulator, currentRating) => accumulator + currentRating, 0);
    const average = sum / ratings.length;
    return Math.round(average * 10) / 10;
};


const updateRating = async (userId) => {
    try {
        const ratings = await userReviewSchema.aggregate([
            { $match: { reviewedUser: new mongoose.Types.ObjectId(userId) } },
            { $project: { rating: 1, _id: 0 } }
        ]);
        rating_arr = ratings.map(review => review.rating);
        rating_avg = calculateAverageRating(rating_arr)
        await userSchema.findByIdAndUpdate(userId, { rating: rating_avg });
        console.log(`User ${userId}'s new average rating: ${rating_avg}`);
        return rating_avg;
    } catch (error) {
        console.error("Error fetching user ratings:", error);
        throw new Error("Internal Server Error");
    }
};

const reviewUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetId = req.params.id;
        const { rating, comment } = req.body;
        const user = await userSchema.findById(userId);
        const targetUser = await userSchema.findById(targetId);
        if (!user || !targetUser) {
            return res.status(401).json({ message: "Invalid User Id" });
        }
        if (!rating || !comment) {
            return res.status(401).json({ message: "All fields are required." });
        }
        const newReview = new userReviewSchema({
            reviewer: userId,
            reviewedUser: targetId,
            rating: rating,
            comment: comment
        });
        await newReview.save();
        await targetUser.updateOne({ $addToSet: { reviews: newReview._id } });
        updateRating(targetId);
        return res.status(200).json({ message: "User Reviewed Successfully." });
    } catch (error) {
        return res.status(500).json(error);
    }
};



const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;
        const review = await userReviewSchema.findById(reviewId);
        const targetId = review.reviewedUser.toString();
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (userId !== review.reviewer.toString()) {
            return res.status(403).json({ message: "User not authorized to delete this review" });
        }

        await userReviewSchema.findByIdAndDelete(reviewId);
        updateRating(targetId);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"})
    }
};


const Reviews = async (req, res) => {
    try {
        const targetId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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

        res.send(userReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



module.exports = { reviewUser, Reviews, deleteReview };