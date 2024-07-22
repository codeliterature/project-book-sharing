const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middleware/authmiddleware');
const verifyOTP = require('../middleware/verifyOtp');


// Import controllers
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const reviewController = require('../controllers/reviewController');


// User Authentication Routes
router.post('/login', authController.login);

// OTP requesting route
router.post('/request-otp', authController.requestOtp);

// User Signup Route (with OTP verification)
router.post('/signup', verifyOTP, authController.signup);

// User Profile Routes (protected)
router.get('/profile', authMiddleware, profileController.getUserProfile);

// User Follow/Unfollow Routes (protected)
router.post('/follow/:id', authMiddleware, profileController.updateFollowing);

// User Followers and Following Routes (public)
router.get('/followers/:id', profileController.getFollowers);
router.get('/following/:id', profileController.getFollowing);

// User Profile Information Route (public)
router.get('/user/:id/', profileController.getUser);

// Review Routes (protected)
router.post('/review/:id', authMiddleware, reviewController.createReview);
router.delete('/delete-review/:id', authMiddleware, reviewController.deleteReview);
router.get('/get-reviews/:id', reviewController.getReviews);




// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));


router.get('/failure', (req, res) => {
    res.send('Failed to authenticate');
});

router.get('/protected', (req, res) => {
    const { user } = req;  
    const token = req.user.token;
    if (!user) return res.status(401).send("Unauthorized");
    const { displayName, emails, photos } = user;
    const email = emails[0].value;
    const photo = photos[0].value;
    res.status(200).send(`Hello ${displayName}, your email is ${email} and your profile picture is <img src="${photo}" alt="Profile Picture"/>`);
});

module.exports = router;
















// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const authmiddleware = require("../middleware/authmiddleware");


// const { login, signup, userDetail, updateFollowing, getFollowers, getFollowing, getUser } = require('../controllers/userController');
// const {reviewUser, Reviews, deleteReview} = require('../controllers/reviewController');


// function isLoggedIn(req, res, next) {
//     req.user ? next() : res.sendStatus(401);
// }



// // router.post('/signup', signup);
// router.post('/login', login);
// router.get("/getuser", authmiddleware, userDetail);
// router.post('/user/:id/follow', authmiddleware, updateFollowing);
// router.get('/user/:id/followers', getFollowers);
// router.get('/user/:id/following', getFollowing);
// router.get('/user/:id/user', getUser);
// router.post('/review/:id', authmiddleware, reviewUser);
// router.delete('/delete-review/:id', authmiddleware, deleteReview);
// router.get ('/getReviews/:id', Reviews);

// router.get('/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// );


// // router.get("/verify-email", async (req, res) => {
// //     try {
        
// //         })
    
// //     } catch(error) {
// //         res.send(error)
// //     }
// // });




// router.get('/failure', (req, res) => {
//     res.send('Failed to authenticate');
// });

// router.get('/protected', isLoggedIn, (req, res) => {
//     let name = req.user.displayName;
//     let email = req.user.emails[0].value;
//     let photo = req.user.photos[0].value;
//     res.send(`Hello ${name}, your email is ${email} and your profile picture is <img src="${photo}" alt="Profile Picture"/>`);
// });



// module.exports = router;