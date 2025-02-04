import mongoose from "mongoose"
const chatSchema = new mongoose.Schema({
    userMessage:{
        required:true,
        type:String,

    },
    aiMessage:{
        required:true,
        type:String,
    }
    
    
},
    {timestamps:true}
)

export const chat = mongoose.model('chat', chatSchema)  ``