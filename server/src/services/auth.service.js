const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN || '1h'
    });

    return token;
}

const registerUser = async (userData) => {
    const { name, email, password, phone,role} = userData;
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    const finalName = name || email.split('@')[0];
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    let userRole = 'user'

    if(role){
        if(!['user','driver'].includes(role)){
            throw new Error('Invalid role')
        }
        userRole=role
    }

    const newUser = new User({
        name: finalName,
        email,
        password: hashedPassword,
        phone,
        role: userRole
    })
    const token = generateToken(newUser);
    await newUser.save();
    const userObejct = newUser.toObject();
    delete userObejct.password;
    return { user: userObejct, token };
}

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user);
    const userObejct = user.toObject();
    delete userObejct.password;
    return { user:userObejct, token };
}

module.exports = {
    registerUser,
    loginUser,
    generateToken
}