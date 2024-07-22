const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const validator = require('validator');
const sendMail = require('../config/transporter');
const OTP = require('../models/otp');

// function to generate random otp
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 401, message: "Invalid Credentials" });
        }
        const data = {
            user: {
                id: user.id,
                email: user.email
            }
        };
        const token = jwt.sign(data, jwtSecret);
        res.status(200).json({ status: 200, message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

// Signup function
const signup = async (req, res) => {
    const { email, password, username, bio, birthday, gender, profilePicture, location } = req.body;

    // Validation
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Email, password, and username are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        // Check for existing user
        const existingUser = await userSchema.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password and create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userSchema({
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            bio,
            birthday,
            gender,
            location,
            profilePicture
        });

        await newUser.save();

        // Generate JWT token
        const tokenData = { user: { id: newUser._id, email: newUser.email } };
        const token = jwt.sign(tokenData, jwtSecret);

        res.status(200).json({ message: 'Signup successful', token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const requestOtp = async (req, res) => {
    const { email } = req.body;
    try {
        await OTP.deleteMany({ email });

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const otpDoc = new OTP({ email, otp: hashedOtp });
        await otpDoc.save();

        await sendMail(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error requesting OTP:', error);
        res.status(500).json({ message: 'Error requesting OTP' });
    }
}

module.exports = { login, signup, requestOtp };
