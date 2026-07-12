require('dotenv').config()

const express = require('express');
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const vehicleRoutes = require('./routes/vehicle.routes')
const tripRoutes = require('./routes/trip.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const cookieParser = require("cookie-parser");
const cors = require('cors')

const PORT =process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
    cors({
        origin:process.env.CLIENT_URL || 'http://localhost:5173', // Fallback for vite dev server
        credentials:true 
    })
);

// Routes 

app.use('/api',authRoutes);
app.use('/api',vehicleRoutes);
app.use('/api',tripRoutes);
app.use('/api',dashboardRoutes);

app.get('/api/health',async(req,res)=>{
    res.status(200).json({
        message:'EvertThing is Fine'
    })
})


const startServer = async() =>{
    connectDB().then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server is server is running on port ${PORT}`);
        });
    }).catch((err)=>{
        console.error(err);
        
    })
}

startServer();
