const express = require('express')
const { register, login, logout, getProfile, auth } = require('../controllers/auth.controller')
const router = express.Router();
const protect = require('../middlewares/auth.middleware')

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/auth', auth)

router.get(
    "/profile",
    protect,
    getProfile
);

module.exports = router;