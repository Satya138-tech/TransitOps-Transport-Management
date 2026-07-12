
const Vehicle = require('../models/vehicle.model');
const mongoose = require('mongoose')

const addNewVehicle = async (vehicleData) => {
    const { registrationNumber, vehicleName, vehicleType, maximumLoad, currentOdometer, acquisitionCost } = vehicleData;

    if (registrationNumber == undefined || vehicleName == undefined || vehicleType == undefined || maximumLoad == undefined || currentOdometer == undefined || acquisitionCost == undefined) {
        throw new Error("All fields are required");
    }

    const normalizedRegistration = registrationNumber.toUpperCase();

    const existingVehicle = await Vehicle.findOne({ registrationNumber: normalizedRegistration });

    if (existingVehicle) {
        throw new Error("Vehicle already exists");
    }

    const newVehicle = new Vehicle({
        registrationNumber: normalizedRegistration,
        vehicleName,
        vehicleType,
        maximumLoad,
        currentOdometer,
        acquisitionCost,
    })

    await newVehicle.save();
    return { vehicle: newVehicle }
}

const getAllVehicles = async (query) => {

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


    if (search) {

        filter.$or = [
            {
                registrationNumber: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                vehicleName: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                vehicleType: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];

    }



    if (status) {

        const allowedStatus = [
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
        ];


        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid vehicle status");
        }


        filter.status = status;
    }



    const skip = (currentPage - 1) * perPage;


    const vehicles = await Vehicle.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 });


    const totalVehicles = await Vehicle.countDocuments(filter);


    return {
        vehicles,

        pagination: {
            totalVehicles,
            currentPage,
            totalPages: Math.ceil(totalVehicles / perPage),
            limit: perPage
        }
    };
};

const getVehicleById = async (vehicleId) => {

    if (!vehicleId) {
        throw new Error('vehicle id not provided')
    }
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new Error("Invalid vehicle id");
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new Error('Vehicle Not found')
    }

    return { vehicle: vehicle }
}

const updateVehicle = async (updateData) => {

    const {
        vehicleId,
        vehicleName,
        vehicleType,
        maximumLoad,
        currentOdometer,
        status
    } = updateData;


    if (!vehicleId) {
        throw new Error("Vehicle id is required");
    }


    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new Error("Invalid vehicle id");
    }


    const vehicle = await Vehicle.findById(vehicleId);


    if (!vehicle) {
        throw new Error("Vehicle not found");
    }

    if (currentOdometer < 0) {
        throw new Error("Invalid odometer value");
    }

    if (maximumLoad < 0) {
        throw new Error("Invalid maximum load");
    }


    if (vehicleName !== undefined) {
        vehicle.vehicleName = vehicleName;
    }


    if (vehicleType !== undefined) {
        vehicle.vehicleType = vehicleType;
    }


    if (maximumLoad !== undefined) {
        vehicle.maximumLoad = maximumLoad;
    }


    if (currentOdometer !== undefined) {
        vehicle.currentOdometer = currentOdometer;
    }



    if (status !== undefined) {

        const allowedStatus = [
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
        ];


        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid vehicle status");
        }


        vehicle.status = status;
    }


    await vehicle.save();


    return {
        vehicle
    };
};

const retireVehicle = async (vehicleId) => {

    if (!vehicleId) {
        throw new Error('vehicle id not provided')
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new Error("Invalid vehicle id");
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new Error("vehicle not found");
    }
    if (vehicle.status === "Retired") {
        throw new Error("Vehicle already retired");
    }

    vehicle.status = 'Retired';
    await vehicle.save();
    return { vehicle: vehicle }
}

module.exports = {
    addNewVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    retireVehicle
};