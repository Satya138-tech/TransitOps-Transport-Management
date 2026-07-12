const express = require('express');
const { addVehicle, getAllVehicles, getVehicleById, updateVehicle, retireVehicle } = require('../controllers/vehicle.controller');
const potect = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware');
const protect = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/vehicles',protect,role('admin'),addVehicle);
router.get('/vehicles',protect,getAllVehicles);
router.get('/vehicles/:id',protect,getVehicleById);
router.put('/vehicles/:id',protect,role('admin','driver'),updateVehicle);
router.patch('/vehicles/:id/retire',protect,role('admin'),retireVehicle);


module.exports = router;
