const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;

const authmiddleware = (req, res, next) => {
    const token = req.header('auth-token');

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