const express = require("express");

const {
    addDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    suspendDriver
} = require("../controllers/driver.controller");

const protect = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/drivers", protect, role("admin"), addDriver);

router.get("/drivers", protect, getAllDrivers);

router.get("/drivers/:id", protect, getDriverById);

router.put("/drivers/:id", protect, role("admin"), updateDriver);

router.patch("/drivers/:id/suspend", protect, role("admin"), suspendDriver);

module.exports = router;