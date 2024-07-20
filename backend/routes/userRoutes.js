const express = require('express');
const router = express.Router();
const passport = require('passport');
const authmiddleware = require("../middleware/authmiddleware");


const { login, signup, userDetail, updateFollowing, getFollowers, getFollowing, getUser } = require('../controllers/userController');
const {reviewUser, Reviews, deleteReview} = require('../controllers/reviewController');


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
router.post('/review/:id', authmiddleware, reviewUser);
router.delete('/delete-review/:id', authmiddleware, deleteReview);
router.get ('/getReviews/:id', Reviews);

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);


// router.get("/verify-email", async (req, res) => {
//     try {
        
//         })
    
//     } catch(error) {
//         res.send(error)
//     }
// });




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