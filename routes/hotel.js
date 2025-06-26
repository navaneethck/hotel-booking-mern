const express = require('express');
const Hotel = require('../models/hotelModel');
const {auth,adminAuth} = require('../middleware/auth');
const router=express.Router();

//ading new hotel admin side
router.post('/Add-Hotel',adminAuth,async (req,res)=>{
    try{
        const {name, location, description, images, price, amenities,rooms,rating,address,contact,availability}=req.body;

        const hotel= new Hotel({name, location, description, images, price, amenities,rooms,rating,address,contact,availability})

        await hotel.save();
        res.status(201).json(hotel,{message:"successfully added"})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.get('/All-Hotel',async (req,res)=>{
    try{
        const hotels= await Hotel.find();
        res.json(hotels)

    }catch(error){
        res.status(500).json({ message: error.message });

    }
})

router.get('/search/:location',async (req,res)=>{
    try{
        const {location}=req.params;
        const {minPrice,maxPrice}=req.query;

        const queryHotel = {location:{$regex:location,$options:'i'}}
      

        if(minPrice || maxPrice){  
            queryHotel.price={};

            if(minPrice){
                queryHotel.price.$gte=Number(minPrice)
            }else if(maxPrice){
                 queryHotel.price.$lte=Number(maxPrice)
            }
        }

        const query=await Hotel.aggregate([{$match:queryHotel}]);

        res.json(query);

    }catch(error){
         res.status(500).json({ message: error.message });

    }
})

module.exports = router;