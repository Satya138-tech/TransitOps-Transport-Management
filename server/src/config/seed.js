const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Vehicle = require('../models/vehicle.model');

const seedDatabase = async () => {
    try {
        const driverCount = await User.countDocuments({ role: 'driver' });
        if (driverCount === 0) {
            console.log('Seeding initial drivers...');
            const hashedPassword = await bcrypt.hash('password123', 12);
            const defaultDrivers = [
                {
                    name: 'Rajesh Kumar',
                    email: 'rajesh@transitops.com',
                    password: hashedPassword,
                    role: 'driver',
                    driverRegion: 'North',
                    driverStatus: 'Available',
                    licenseValid: true,
                    safetyScore: 95,
                    phone: '9876543210'
                },
                {
                    name: 'Amit Patel',
                    email: 'amit@transitops.com',
                    password: hashedPassword,
                    role: 'driver',
                    driverRegion: 'South',
                    driverStatus: 'Available',
                    licenseValid: true,
                    safetyScore: 92,
                    phone: '9876543211'
                },
                {
                    name: 'Suresh Sharma',
                    email: 'suresh@transitops.com',
                    password: hashedPassword,
                    role: 'driver',
                    driverRegion: 'East',
                    driverStatus: 'Available',
                    licenseValid: true,
                    safetyScore: 88,
                    phone: '9876543212'
                },
                {
                    name: 'Vijay Singh',
                    email: 'vijay@transitops.com',
                    password: hashedPassword,
                    role: 'driver',
                    driverRegion: 'West',
                    driverStatus: 'Available',
                    licenseValid: true,
                    safetyScore: 97,
                    phone: '9876543213'
                },
                {
                    name: 'Ramesh Gupta',
                    email: 'ramesh@transitops.com',
                    password: hashedPassword,
                    role: 'driver',
                    driverRegion: 'Central',
                    driverStatus: 'Available',
                    licenseValid: true,
                    safetyScore: 91,
                    phone: '9876543214'
                }
            ];
            await User.insertMany(defaultDrivers);
            console.log('Drivers seeded successfully.');
        }

        const vehicleCount = await Vehicle.countDocuments();
        if (vehicleCount === 0) {
            console.log('Seeding initial vehicles...');
            const defaultVehicles = [
                {
                    registrationNumber: 'DL-01-A-1234',
                    vehicleName: 'Ashok Leyland Dost',
                    vehicleType: 'Van',
                    maxLoadCapacity: 1500,
                    odometer: 12000,
                    acquisitionCost: 750000,
                    status: 'Available',
                    region: 'North',
                    acquisitionDate: new Date('2025-01-10'),
                    notes: 'Seeded vehicle'
                },
                {
                    registrationNumber: 'MH-02-B-5678',
                    vehicleName: 'Tata Ace Gold',
                    vehicleType: 'Mini Truck',
                    maxLoadCapacity: 800,
                    odometer: 24000,
                    acquisitionCost: 550000,
                    status: 'Available',
                    region: 'South',
                    acquisitionDate: new Date('2024-06-15'),
                    notes: 'Seeded vehicle'
                },
                {
                    registrationNumber: 'KA-03-C-9012',
                    vehicleName: 'Mahindra Bolero Pik-Up',
                    vehicleType: 'Truck',
                    maxLoadCapacity: 2000,
                    odometer: 32000,
                    acquisitionCost: 900000,
                    status: 'Available',
                    region: 'East',
                    acquisitionDate: new Date('2024-11-20'),
                    notes: 'Seeded vehicle'
                },
                {
                    registrationNumber: 'GJ-04-D-3456',
                    vehicleName: 'Tata Winger',
                    vehicleType: 'Van',
                    maxLoadCapacity: 1200,
                    odometer: 15000,
                    acquisitionCost: 820000,
                    status: 'Available',
                    region: 'West',
                    acquisitionDate: new Date('2025-03-05'),
                    notes: 'Seeded vehicle'
                },
                {
                    registrationNumber: 'HR-05-E-7890',
                    vehicleName: 'Eicher Pro 2049',
                    vehicleType: 'Truck',
                    maxLoadCapacity: 3500,
                    odometer: 45000,
                    acquisitionCost: 1400000,
                    status: 'Available',
                    region: 'Central',
                    acquisitionDate: new Date('2023-08-12'),
                    notes: 'Seeded vehicle'
                }
            ];
            await Vehicle.insertMany(defaultVehicles);
            console.log('Vehicles seeded successfully.');
        }
    } catch (error) {
        console.error('Failed to seed database:', error);
    }
};

module.exports = seedDatabase;
