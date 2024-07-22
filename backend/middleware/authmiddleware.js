const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;

const authmiddleware = (req, res, next) => {
<<<<<<< HEAD
    const token = req.header("auth-token");
    try {
        if (!token) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Verification Error: Please try again." });
            }
            // if (req.params.id) {
            //     if (req.params.id !== user.user.id) {
            //         return res.status(403).json({message: "Unauthorized"});
            //     }
            //     if (req.params.id === req.body.followerId) {
            //         return res.status(403).json({message: "User cannot follow themselves"});
            //     }
            // }
            req.user = user.user;
            next();
        });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized: Token expired" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
=======
    const token = req.header('auth-token');
>>>>>>> 4aaeec319a43f35fc918e6468a739dd69349e921

    if (!token) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Unauthorized: Token expired' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            } else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }

        req.user = decoded.user;
        next();
    });
};

module.exports = authmiddleware;