const express = require('express');
const router = express.Router();
const passport = require('passport');
const authmiddleware = require("../middleware/authmiddleware");


const { login, signup, userDetail, updateFollowing, getFollowers, getFollowing, getUser } = require('../controllers/userController');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.post('/signup', signup);
router.post('/login', login);
router.get("/getuser", authmiddleware, userDetail);
router.post('/user/:id/follow', authmiddleware, updateFollowing);
router.get('/user/:id/followers', getFollowers);
router.get('/user/:id/following', getFollowing);
router.get('/user/:id/user', getUser);


router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);


router.get('/failure', (req, res) => {
    res.send('Failed to authenticate');
});

router.get('/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    let email = req.user.emails[0].value;
    let photo = req.user.photos[0].value;
    res.send(`Hello ${name}, your email is ${email} and your profile picture is <img src="${photo}" alt="Profile Picture"/>`);
});



module.exports = router;