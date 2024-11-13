import mongoose from "mongoose";
import { DB_NAME } from "./db_name.js";

async function dbconnect  () {
    try{
        await mongoose.connect(`${process.env.URL}/${DB_NAME}`)
        console.log('correctly logged')
    }   
    catch(error){
        console.log(error)
    }



}

export default dbconnect;