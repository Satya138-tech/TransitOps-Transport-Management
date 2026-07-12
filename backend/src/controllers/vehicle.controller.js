const vehicleService = require("../services/vehicle.service");


// Create Vehicle
const addVehicle = async(req, res)=>{

    try {

        const result = await vehicleService.addNewVehicle(req.body);

        return res.status(201).json({
            success:true,
            message:"Vehicle created successfully",
            data:result
        });


    } catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }
};



// Get All Vehicles
const getAllVehicles = async(req,res)=>{

    try {

        const result = await vehicleService.getAllVehicles(req.query);


        return res.status(200).json({
            success:true,
            data:result
        });


    } catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



// Get Vehicle By ID
const getVehicleById = async(req,res)=>{

    try {

        const result = await vehicleService.getVehicleById(
            req.params.id
        );


        return res.status(200).json({
            success:true,
            data:result
        });


    } catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



// Update Vehicle
const updateVehicle = async(req,res)=>{

    try {

        const updateData = {
            vehicleId:req.params.id,
            ...req.body
        };


        const result = await vehicleService.updateVehicle(
            updateData
        );


        return res.status(200).json({
            success:true,
            message:"Vehicle updated successfully",
            data:result
        });


    } catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



// Retire Vehicle
const retireVehicle = async(req,res)=>{

    try {

        const result = await vehicleService.retireVehicle(
            req.params.id
        );


        return res.status(200).json({
            success:true,
            message:"Vehicle retired successfully",
            data:result
        });


    } catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }

};



module.exports = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    retireVehicle
};  