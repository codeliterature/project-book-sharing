const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const jwtSecret = process.env.JWT_SECRET;


// Function to authenticate user and generate JWT
const authUser = async (profile) => {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const username = displayName.replace(/\s+/g, '_').toLowerCase();
    const profilePicture = photos[0].value;
    // Find or create user
    let user = await userSchema.findOne({ email });
    if (!user) {
        user = new userSchema({
            googleId: id,
            username,
            email,
            profilePicture
        });
        await user.save();
    }
    // Generate JWT token
    const data = {
        user: {
            id: user.id,
            email: user.email
        }
    };
    const token = jwt.sign(data, jwtSecret);
    return { user, token }; // Return both user and token
};


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Google Strategy Initialized');
    const { user, token } = await authUser(profile);
    // console.log("token", token);
    // const data = {
    //     profile: profile,
    //     token: token
    // };
    const data = {
        ...profile,
        token: token
    };
    done(null, data);
}));


// Serialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user
passport.deserializeUser((obj, done) => {
    try {
        done(null, obj);
    } catch (error) {
        done(error, null);
    }
});
