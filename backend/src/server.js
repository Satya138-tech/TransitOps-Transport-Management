require('dotenv').config()

const express = require('express');
const connectDB = require('./config/db')


const app = express();;


const PORT =process.env.PORT || 3000;

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
