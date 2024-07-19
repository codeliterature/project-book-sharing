const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Jwtsecret = process.env.JWT_SECRET;

const authUser = async (profile) => {
    let googleId = profile.id;
    const user = await userSchema.findOne({ googleId });
    if (!user) {
        const userData = {
            googleId: profile.id,
            username: profile.displayName,
            profilePicture: profile.photos[0].value,
            email: profile.emails[0].value,
            // gender: profile.gender,
            // birthday: profile.birthday,
            // location: profile._json.location
        };
        const newUser = new userSchema(userData);
        const savedUser = await newUser.save();
        const token = jwt.sign({user : {id : savedUser._id.toString()}}, Jwtsecret);
        // console.log("the token from oAuth", token);
    }
};


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Google Strategy Initialized');
    await authUser(profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
