const OTP = require('../models/otp');
const bcrypt = require('bcrypt');

const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    try {
        const otpDoc = await OTP.findOne({ email });
        if (!otpDoc) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
        const isMatch = await bcrypt.compare(otp, otpDoc.otp);
        if (isMatch) {
            await OTP.deleteOne({ email });
            req.email = email;
            next();
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

module.exports = verifyOTP;