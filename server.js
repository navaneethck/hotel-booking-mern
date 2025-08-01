const express= require('express');
const cors = require('cors');
const connectedDB=require('./config/db')
require('dotenv').config();
const authRout= require("./routes/auth");
const authHotel= require('./routes/hotel');
const authBooking = require('./routes/bookingRoutes')
const adminAuth = require('./routes/adminAuth')

const app = express();

app.use(express.json());
app.use(cors());


app.get('/api/test',(req,res)=>{
    res.json({message:'server is working..!'})
})

app.use('/api/auth',authRout);
app.use('/api/hotels',authHotel)
app.use('/api/booking',authBooking);
app.use('/api/All-bookings',adminAuth);


connectedDB()

const PORT = process.env.PORT || 3400
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
