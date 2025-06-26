const express= require('express');
const cors = require('cors');
const connectedDB=require('./config/db')
require('dotenv').config();
const authRout= require("./routes/auth");
const authHotel= require('./routes/hotel');


const app = express();

app.use(express.json());
app.use(cors());


app.get('/api/test',(req,res)=>{
    res.json({message:'server is working..!'})
})

app.use('/api/auth',authRout);
app.use('/api/hotels',authHotel)





connectedDB()

const PORT = process.env.PORT || 3400
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
