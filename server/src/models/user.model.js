const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        default: function() {
            return this.email ? this.email.split('@')[0] : 'User';
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please enter a valid email address']
    },
    password:{
        type:String,
        required:true,
        select:false,
        minLength:[8,'Password must contain at least 8 letters'],
    },
    phone:{
        type:String,
        trim:true,
        default:''
    },
    role:{
        type:String,
        enum:['admin','user','driver'],
        default:'user'
    },
    driverStatus: {
        type: String,
        enum: ['Available', 'On Trip', 'Suspended'],
        default: 'Available'
    },
    driverRegion: {
        type: String,
        enum: ['North', 'South', 'East', 'West', 'Central'],
        default: 'North'
    },
    licenseValid: {
        type: Boolean,
        default: true
    },
    safetyScore: {
        type: Number,
        default: 95
    },
    trips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }]
},{timestamps:true});

const User = mongoose.model('User',userSchema);

module.exports = User;