const mongoose = require('mongoose')
const seedDatabase = require('./seed')

const connectDB = async()=>{
    const uri = process.env.MONGO_URI;
    const options = {
        serverSelectionTimeoutMS:5000,
        socketTimeoutMS:45000,
    }
    let retries  = 5
    while(retries > 0){
        try {
            const conn = await mongoose.connect(uri,options)
            console.log('MongoDB Connected Successfully')
            await seedDatabase();
            return
        } catch (error) {
         retries -=1;
         console.log(`MongoDB connection failed. Retries left:${retries}.Error:${error.message}`);
         if(retries === 0){
            console.error(`Could not connect to MongoDB after multiple attempts.Exiting Process`);
            process.exit(1)
         }
         await new Promise(r => setTimeout(r,5000));
            
        }
    }
}

mongoose.connection.on('disconnected',()=>{
    console.log('MongoDB disconnected. Attempting to reconnect...');
})

mongoose.connection.on('reconnected',()=>{
    console.log(`MongoDB reconnected successfully`);
})

module.exports = connectDB