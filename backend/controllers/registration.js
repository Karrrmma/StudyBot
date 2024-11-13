import mongoose from "mongoose";
import {User} from './dbcontroller/user.js'
import { Router } from "express";
import bcrypt from 'bcrypt'
const router = Router();


router.post('/', async(req, res)=>{
    const {username, password} = req.body
    try{
        const userExist  = await User.findOne({username})
        if (userExist){
            return res.status(400).json({message:'username exists'})
        }
        const hashpw = await bcrypt.hash(password,10)
        const newUser = await User.create({username, password:hashpw})
        return res.status(200).json({message: "registration completed"})
    }
    catch(error){
        return res.status(400).json({message:'Server error'})

    }
    
})
export default router;