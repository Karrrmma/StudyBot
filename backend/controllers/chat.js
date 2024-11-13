import mongoose from "mongoose";
import { Router } from "express";
import tokenVerify from "./jwtverify.js";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Chat}  from "./dbcontroller/chat.js";
import { User } from "./dbcontroller/user.js";
const router= Router()

router.post('/',tokenVerify, async (req, res)=>{
    const {chat} = req.body

    try{
        const username = req.user.username;
        
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({message:'user not fouund'})
        }

        const savechat = await Chat.create({sendby:req.user._id, chat})
        console.log('message saved')
        return res.status(201).json({message: 'message saved', savechat})
      
    }
    catch(error){
        
        return res.status(500).json({message:"server error"})

    }


})
router.get('/', tokenVerify, async(req, res)=>{
    try{
        console.log('Fetching messages for user:', req.user.username,  'with ID', req.user._id);
     
        /*  const newChatMessage = new Chat({
            sendby: req.user._id, // Assuming `req.user._id` is the ObjectId of the user
            chat: 'This is a manually added message!'
        });

        // Save the new message
        await newChatMessage.save();
        console.log('message saved' ,newChatMessage)
*/
        const messages = await Chat.find().sort({ createdAt: 1 }).populate('sendby', 'username').exec();
        console.log('Messages found:', messages);
         
        res.status(200).json(messages)
    }
    catch(error){
        console.error('cannot fetch messages', error);
        res.status(500).json({ message: "Server error" });

    }
})




export default router;