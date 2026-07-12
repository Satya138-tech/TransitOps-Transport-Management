const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,  
        trim:true,
        minLength:[3,'Name must contain at least 3 letters'],
        maxLength:[30,'Name has atmost 30 charaters'],
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


},{timestamps:true});

const User = mongoose.model('User',userSchema);

module.exports = User;