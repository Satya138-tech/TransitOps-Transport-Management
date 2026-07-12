const mongoose = require("mongoose");
const Driver = require("../models/driver.model");

// Create Driver
const addNewDriver = async (driverData) => {

    const {
        firstName,
        lastName,
        licenseNumber,
        licenseCategory,
        licenseExpiry,
        contactNumber,
        safetyScore
    } = driverData;

    if (
        firstName === undefined ||
        lastName === undefined ||
        licenseNumber === undefined ||
        licenseCategory === undefined ||
        licenseExpiry === undefined ||
        contactNumber === undefined
    ) {
        throw new Error("All required fields must be provided");
    }

    const existingDriver = await Driver.findOne({
        licenseNumber: licenseNumber.toUpperCase()
    });

    if (existingDriver) {
        throw new Error("Driver already exists");
    }

    const newDriver = new Driver({
        firstName,
        lastName,
        licenseNumber: licenseNumber.toUpperCase(),
        licenseCategory,
        licenseExpiry,
        contactNumber,
        safetyScore
    });

    await newDriver.save();

    return {
        driver: newDriver
    };
};


// Get All Drivers
const getAllDrivers = async (query) => {

    const {
        page = 1,
        limit = 10,
        search = "",
        status
    } = query;

    const currentPage = Number(page);
    const perPage = Number(limit);

    if (currentPage < 1) {
        throw new Error("Invalid page number");
    }

    if (perPage < 1) {
        throw new Error("Invalid limit");
    }

    const filter = {};

    if (search.trim()) {

        filter.$or = [
            {
                firstName: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                lastName: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                licenseNumber: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                contactNumber: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    if (status) {

        const allowedStatus = [
            "Available",
            "On Trip",
            "Off Duty",
            "Suspended"
        ];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid driver status");
        }

        filter.status = status;
    }

    const skip = (currentPage - 1) * perPage;

    const drivers = await Driver.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 });

    const totalDrivers = await Driver.countDocuments(filter);

    return {
        drivers,
        pagination: {
            totalDrivers,
            currentPage,
            totalPages: Math.ceil(totalDrivers / perPage),
            limit: perPage
        }
    };
};


// Get Driver By Id
const getDriverById = async (driverId) => {

    if (!driverId) {
        throw new Error("Driver id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
        throw new Error("Invalid driver id");
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
        throw new Error("Driver not found");
    }

    return {
        driver
    };
};


// Update Driver
const updateDriver = async (updateData) => {

    const {
        driverId,
        firstName,
        lastName,
        licenseCategory,
        licenseExpiry,
        contactNumber,
        safetyScore,
        status
    } = updateData;

    if (!driverId) {
        throw new Error("Driver id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
        throw new Error("Invalid driver id");
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
        throw new Error("Driver not found");
    }

    if (firstName !== undefined) {
        driver.firstName = firstName;
    }

    if (lastName !== undefined) {
        driver.lastName = lastName;
    }

    if (licenseCategory !== undefined) {
        driver.licenseCategory = licenseCategory;
    }

    if (licenseExpiry !== undefined) {
        driver.licenseExpiry = licenseExpiry;
    }

    if (contactNumber !== undefined) {
        driver.contactNumber = contactNumber;
    }

    if (safetyScore !== undefined) {

        if (safetyScore < 0 || safetyScore > 100) {
            throw new Error("Safety score must be between 0 and 100");
        }

        driver.safetyScore = safetyScore;
    }

    if (status !== undefined) {

        const allowedStatus = [
            "Available",
            "On Trip",
            "Off Duty",
            "Suspended"
        ];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid driver status");
        }

        driver.status = status;
    }

    await driver.save();

    return {
        driver
    };
};


// Suspend Driver (Soft Delete)
const suspendDriver = async (driverId) => {

    if (!driverId) {
        throw new Error("Driver id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
        throw new Error("Invalid driver id");
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
        throw new Error("Driver not found");
    }

    if (driver.status === "Suspended") {
        throw new Error("Driver already suspended");
    }

    driver.status = "Suspended";

    await driver.save();

    return {
        driver
    };
};

module.exports = {
    addNewDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    suspendDriver
};