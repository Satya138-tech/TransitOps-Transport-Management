const express = require('express');
const { getAdminDashboard, getDriverDashboard, getUserPortal } = require('../controllers/dashboard.controller');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/admin/dashboard', protect, getAdminDashboard);
router.get('/drivers/dashboard', protect, getDriverDashboard);
router.get('/users/portal', protect, getUserPortal);

module.exports = router;
