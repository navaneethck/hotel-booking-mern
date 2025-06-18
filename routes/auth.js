const express = require('express');
const bcrypt = require('bcryptjs');
const User= require('../models/userModel');

const router = express.Router();

router.post('/register', async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        const checkExistingUser = await User.findOne({email});
        if(checkExistingUser){
            return res.status(400).json({message:"user already exists"})

        }

        const hashed = await bcrypt.hash(password,10);
        const user = new User ({name,email,password:hashed});

        await user.save();

        res.status(201).json({message:"user registered successfully"})

    }catch(error){
        res.status(500).json({message:error.message})

    }
})

module.exports = router;