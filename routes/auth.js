const express = require('express');
const bcrypt = require('bcryptjs');
const User= require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const router = express.Router();

router.post('/register', async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;

        const checkExistingUser = await User.findOne({email});
        if(checkExistingUser){
            return res.status(400).json({message:"user already exists"})

        }
        const alowedRoles=['user','admin'];
        const userRole = alowedRoles.includes(role)?role:'user';
        const hashed = await bcrypt.hash(password,10);
        const user = new User ({name,email,password:hashed,role: userRole});

        await user.save();

        res.status(201).json({message:"user registered successfully"})

    }catch(error){
        res.status(500).json({message:error.message})

    }
})

router.post('/login',async (req,res)=>{
   try{
     const {email,password}=req.body;

     const user= await User.findOne({email});
     if(!user){
        return res.status(400).json({message:"user not found"})
     }

     const checkMatch = await bcrypt.compare(password,user.password);

     if(!checkMatch){
        return res.status(400).json({message:'invalid password'});
     }

     const token =jwt.sign({
        userId:user._id,
        role: user.role
     },
    process.env.JWT_SECRET,
    {expiresIn:'1d'});

    res.json({
        token,
        user:{ id: user._id,
              name: user.name,
              email: user.email,
              role: user.role}
    })


   }catch(error){
    res.status(500).json({message:error.message});

   }

  

})

module.exports = router;