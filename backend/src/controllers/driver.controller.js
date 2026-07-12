const driverService = require("../services/driver.service");


// Create Driver
const addDriver = async (req, res) => {

    try {

        const result = await driverService.addNewDriver(req.body);

        return res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


// Get All Drivers
const getAllDrivers = async (req, res) => {

    try {

        const result = await driverService.getAllDrivers(req.query);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


// Get Driver By Id
const getDriverById = async (req, res) => {

    try {

        const result = await driverService.getDriverById(req.params.id);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


// Update Driver
const updateDriver = async (req, res) => {

    try {

        const updateData = {
            driverId: req.params.id,
            ...req.body
        };

        const result = await driverService.updateDriver(updateData);

        return res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


// Suspend Driver
const suspendDriver = async (req, res) => {

    try {

        const result = await driverService.suspendDriver(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Driver suspended successfully",
            data: result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    addDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    suspendDriver
};