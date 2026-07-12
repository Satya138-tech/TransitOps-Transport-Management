const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    dispatchDate: {
        type: Date,
        required: true
    },
    dispatchWindow: {
        type: String,
        required: true,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night']
    },
    cargoWeight: {
        type: Number,
        required: true
    },
    plannedDistance: {
        type: Number,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Central']
    },
    priority: {
        type: String,
        required: true,
        enum: ['Standard', 'High', 'Critical']
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled'],
        default: 'Assigned'
    },
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;