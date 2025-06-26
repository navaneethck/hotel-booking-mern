const jwt = require('jsonwebtoken');
const User= require('../models/userModel');
require('dotenv').config(); 


//checking for if the user is authenticated or not
const auth= async(req,res,next)=>{
    try{
        const token =req.header('Authorzation')?.replace('Bearer ','');
        
        if(!token){
            return res.status(401).json({message:"No token,access denied"});
        }
    
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;

        next()

    }catch(error){
        res.status(401).json({message:"Token is not valid"})
    }
}

//checking for if the admin is authenticated or not

const adminAuth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization')?.replace('Bearer ','');
        if(!token){
            res.status(401).json({message:"No token,access denied"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role !== 'admin'){
            return res.status(403).json({message:'Admin access required'})
        }

        req.user=decoded;
        next();


    }catch(error){
            res.status(401).json({ message: 'Token is not valid' });

    }
}

module.exports= {auth,adminAuth};