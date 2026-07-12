const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    vehicleName: {
        type: String,
        required: true,
        trim: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['Van', 'Truck', 'Mini Truck', 'Bus', 'Trailer', 'EV']
    },
    maxLoadCapacity: {
        type: Number,
        required: true
    },
    odometer: {
        type: Number,
        required: true
    },
    acquisitionCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available'
    },
    region: {
        type: String,
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Central']
    },
    acquisitionDate: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    },
    trips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }]
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;