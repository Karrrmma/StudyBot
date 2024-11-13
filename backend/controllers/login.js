import mongoose from "mongoose";
import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User}  from "./dbcontroller/user.js";


const router = Router();

router.post('/', async (req, res)=>{
    try{
        const {username, password} = req.body;

       const user =  await User.findOne({username})
       console.log('Retrieved User:', user);
        if(!user){
            console.log('username found')
            return res.status(400).json({ message: 'Invalid username or password' });

        }
        const isMatch = await bcrypt.compareSync(password, user.password);
        console.log('Password match:', isMatch);

        if(!isMatch){
            console.log('password not matched')
            return res.status(400).json({message:'password not matched'})
        }
        const token = jwt.sign({
            username:user.username,
            userId: user._id

        }, process.env.JWT,{expiresIn:'1hr'}
        );
        return res.status(200).json({message:'logged in', token});

    }
    catch(error){
        console.error('Server error:', error);

        return res.status(500).json({message:'server error now'})

    }
   

})

export default router;