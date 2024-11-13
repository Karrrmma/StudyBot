import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    sendby:{
        type:Schema.Types.ObjectId, 
        ref:'User', 
        required: true
    },
    chat:{
        type:String,
        required: true
    }
    
    },{timestamps:true}

)
export const Chat = mongoose.model('Chat', chatSchema);