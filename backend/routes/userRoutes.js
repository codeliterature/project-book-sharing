const express = require('express');
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");


const { login, signup, userDetail, updateFollowing } = require('../controllers/userController');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.post('/signup', signup);
router.post('/login', login);
router.get("/getuser", authmiddleware, userDetail);
router.post('/user/:id/follow', authmiddleware, updateFollowing);


module.exports = router;