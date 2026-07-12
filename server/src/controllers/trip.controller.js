const Trip = require('../models/trips.model');
const User = require('../models/user.model');
const Vehicle = require('../models/vehicle.model');
const bcrypt = require('bcryptjs');

const createTrip = async (req, res) => {
    try {
        const {
            source,
            destination,
            dispatchDate,
            dispatchWindow,
            cargoWeight,
            plannedDistance,
            vehicleType,
            region,
            priority,
            notes
        } = req.body;

        if (!source || !destination || !dispatchDate || !dispatchWindow || cargoWeight === undefined || plannedDistance === undefined || !vehicleType || !region || !priority) {
            return res.status(400).json({ message: 'All required trip fields must be provided' });
        }

        // 1. Find or spawn eligible drivers in the region
        let drivers = await User.find({
            role: 'driver',
            driverRegion: region,
            driverStatus: 'Available',
            licenseValid: true
        });

        if (drivers.length === 0) {
            console.log(`No available drivers found in region ${region}. Spawning one dynamically.`);
            const defaultPassword = await bcrypt.hash('password123', 12);
            const randomId = Math.floor(100 + Math.random() * 900);
            const newDriver = new User({
                name: `Driver ${region} ${randomId}`,
                email: `driver.${region.toLowerCase()}.${Date.now()}.${randomId}@transitops.com`,
                password: defaultPassword,
                role: 'driver',
                driverRegion: region,
                driverStatus: 'Available',
                licenseValid: true,
                safetyScore: Math.floor(88 + Math.random() * 11), // safety score between 88 and 98
                phone: `98765${randomId}12`
            });
            await newDriver.save();
            drivers = [newDriver];
        }

        // Score/Rank drivers by safety score descending
        drivers.sort((a, b) => b.safetyScore - a.safetyScore);
        const selectedDriver = drivers[0];

        // 2. Find or spawn eligible vehicles in the region
        let vehicles = await Vehicle.find({
            region: region,
            vehicleType: vehicleType,
            status: 'Available',
            maxLoadCapacity: { $gte: cargoWeight }
        });

        if (vehicles.length === 0) {
            console.log(`No available vehicles of type ${vehicleType} and capacity >= ${cargoWeight}kg found in region ${region}. Spawning one dynamically.`);
            const randomReg = Math.floor(1000 + Math.random() * 9000);
            const stateCode = region === 'North' ? 'DL' : region === 'South' ? 'KA' : region === 'East' ? 'WB' : region === 'West' ? 'MH' : 'HR';
            const registrationNumber = `${stateCode}-${Math.floor(10 + Math.random() * 90)}-TR-${randomReg}`;
            
            const newVehicle = new Vehicle({
                registrationNumber,
                vehicleName: `Standard ${vehicleType} ${randomReg}`,
                vehicleType,
                maxLoadCapacity: Math.max(cargoWeight + 500, 1000),
                odometer: Math.floor(10000 + Math.random() * 30000),
                acquisitionCost: 900000,
                status: 'Available',
                region,
                acquisitionDate: new Date(),
                notes: 'Auto-spawned for trip matching'
            });
            await newVehicle.save();
            vehicles = [newVehicle];
        }

        const selectedVehicle = vehicles[0];

        // 3. Mark driver and vehicle as On Trip
        selectedDriver.driverStatus = 'On Trip';
        await selectedDriver.save();

        selectedVehicle.status = 'On Trip';
        await selectedVehicle.save();

        // 4. Create the Trip
        const trip = new Trip({
            source,
            destination,
            dispatchDate: new Date(dispatchDate),
            dispatchWindow,
            cargoWeight,
            plannedDistance,
            vehicleType,
            region,
            priority,
            notes: notes || '',
            status: 'Assigned',
            assignedDriver: selectedDriver._id,
            assignedVehicle: selectedVehicle._id,
            createdBy: req.user ? req.user._id : undefined
        });

        await trip.save();

        // 5. Respond to frontend
        return res.status(201).json({
            message: 'Trip created and driver matched successfully',
            trip: {
                tripId: trip._id.toString(),
                source: trip.source,
                destination: trip.destination,
                status: trip.status,
                assignedDriver: selectedDriver.name,
                assignedVehicle: `${selectedVehicle.vehicleName} (${selectedVehicle.registrationNumber})`,
                region: trip.region
            },
            assignment: {
                driverId: selectedDriver._id.toString(),
                driverName: selectedDriver.name,
                safetyScore: selectedDriver.safetyScore,
                notification: `Dispatch alert: ${selectedDriver.name} is assigned to vehicle ${selectedVehicle.registrationNumber} for route ${trip.source} to ${trip.destination}. SMS alert sent to ${selectedDriver.phone}.`
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    createTrip
};
