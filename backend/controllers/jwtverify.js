import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { User } from "./dbcontroller/user.js";
import createError from 'http-errors';

async function tokenVerify(req, res, next){
   
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token){
        console.log('no token ')
        
        return res.status(401).json({message:'acces denied no token'});
    }
    try{
        
        const verify = jwt.verify(token, process.env.JWT);
        const user = await User.findById(verify.userId);
        if(!user){
            return res.status(404).json({message:"user not found in jwt"});
        }
        req.user = user;
        next();


   }
   catch(error){
        console.error('Invalid token:', error);

        return res.status(400).json({message:'invalid jjjjtoken'})
   } 

}
export default tokenVerify;
