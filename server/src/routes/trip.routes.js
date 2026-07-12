const express = require('express');
const { createTrip } = require('../controllers/trip.controller');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/trips', protect, createTrip);

module.exports = router;
