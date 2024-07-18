const express = require("express");
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;

//login function
const login = async (req, res) => {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email });
    if (!user) {
        return res.status(404).json({ status: 404, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ status: 401, message: "Invalid Credentials" });
    } else {
        const data = {
            user: {
                id: user.id,
                email: user.email
            }
        }
        const token = jwt.sign(data, jwtSecret);
        res.status(200).json({ status: 200, message: "Login successful", token });
    }

}

// signup function
const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userSchema.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log("signup hash", hash);
        const newUser = new userSchema({
            username: username,
            email: email,
            password: hash
        });
        await newUser.save();
        const data = {
            user: {
                id: newUser._id,
                email: newUser.email
            }
        }
        const token = jwt.sign(data, jwtSecret);
        res.status(200).json({ status: 200, message: "Signup successful", token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
}

// fetch user detail function
const userDetail = async (req, res) => {
    try {
        userId = req.user.id;
        const user = await userSchema.findById(userId).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error, something occured", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
}

// update following function
const updateFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const { followerId } = req.body;
        const user = await userSchema.findById(userId);
        const follower = await userSchema.findById(followerId);
        if (!user || !follower) {
            console.log("not")
            return res.status(404).json({ message: "User not found" });
        }
        if (user.following.includes(followerId)) {
            await user.updateOne({ $pull: { following: followerId } });
            await follower.updateOne({ $pull: { followers: userId } });
            res.json({ message: "User unfollowed successfully" });
        } else {
            await user.updateOne({ $addToSet: { following: followerId } });
            await follower.updateOne({ $addToSet: { followers: userId } });
            res.json({ message: "User followed successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { signup, login, userDetail, updateFollowing };