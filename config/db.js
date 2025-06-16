const dotenv = require('dotenv');
dotenv.config();
const mongoose= require('mongoose');
const MONGO_URI= process.env.MONGO_URI;

const connectedDB=async()=>{
    try{

        const connected = await mongoose.connect(MONGO_URI);
        console.log(`Mongodb connected: ${connected.connection.host}`)

    }catch(error){
        console.error(`error:${error.message}`)

    }
}

module.exports = connectedDB;