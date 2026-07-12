const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registrationNumber:{
        type:String,
        required:true,
        unique:true
    },
    vehicleName:{
        type:String,
        required:true
    },
    vehicleType:{
        type:String,
        required:true
    },
    maximumLoad:{
        type:Number,
        required:true,
        min:0
    },
    currentOdometer:{
        type:Number,
        required:true,
        min:0
    },
    acquisitionCost:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Available','On-Trip','In-Shop','Retired'],
        required:true,
        default:'Available'
    }
},{timestamps:true});


const Vehicle = mongoose.model('Vehicle',vehicleSchema);

module.exports = Vehicle