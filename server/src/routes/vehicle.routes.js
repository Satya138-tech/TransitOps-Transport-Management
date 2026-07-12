const express = require('express');
const { createVehicle } = require('../controllers/vehicle.controller');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/vehicles', protect, createVehicle);

module.exports = router;
