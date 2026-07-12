const Vehicle = require('../models/vehicle.model');

const createVehicle = async (req, res) => {
    try {
        const {
            registrationNumber,
            vehicleName,
            vehicleType,
            maxLoadCapacity,
            odometer,
            acquisitionCost,
            status,
            region,
            acquisitionDate,
            notes
        } = req.body;

        if (!registrationNumber || !vehicleName || !vehicleType || maxLoadCapacity === undefined || odometer === undefined || acquisitionCost === undefined || !region) {
            return res.status(400).json({ message: 'All required vehicle fields must be provided' });
        }

        const existingVehicle = await Vehicle.findOne({ registrationNumber });
        if (existingVehicle) {
            return res.status(409).json({ message: 'A vehicle with this registration number already exists' });
        }

        const vehicle = new Vehicle({
            registrationNumber,
            vehicleName,
            vehicleType,
            maxLoadCapacity,
            odometer,
            acquisitionCost,
            status: status || 'Available',
            region,
            acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined,
            notes: notes || ''
        });

        await vehicle.save();

        return res.status(201).json({
            message: 'Vehicle registered successfully',
            vehicle: {
                id: vehicle._id,
                registrationNumber: vehicle.registrationNumber,
                vehicleName: vehicle.vehicleName,
                vehicleType: vehicle.vehicleType,
                maxLoadCapacity: vehicle.maxLoadCapacity,
                odometer: vehicle.odometer,
                acquisitionCost: vehicle.acquisitionCost,
                status: vehicle.status,
                region: vehicle.region,
                acquisitionDate: vehicle.acquisitionDate ? vehicle.acquisitionDate.toISOString().split('T')[0] : '',
                notes: vehicle.notes
            }
        });
    } catch (error) { 
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    createVehicle
};
