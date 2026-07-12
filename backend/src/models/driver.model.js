const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    licenseCategory: {
        type: String,
        required: true
    },
    licenseExpiry: {
        type: Date,
        required: true,

    },
    contactNumber: {
        type: String,
        required: true,
        trim:true
    },
    safetyScore: {
        type: Number,
        default: 100,
        required: true,
        min:0,
        max:100
    },
    status: {
        type: String,
        enum: ["Available", "On Trip", "Off Duty", "Suspended"],
        default: 'Available'
    }
}, { timestamps: true })

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver