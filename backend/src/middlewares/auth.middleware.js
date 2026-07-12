const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async(req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = protect;