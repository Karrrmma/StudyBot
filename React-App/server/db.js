import mongoose from "mongoose";
import { DB_NAME } from "./dbname.js";
const connect = async () => {
    try {
        if (!process.env.URL) {
            throw new Error('MongoDB URL is not set in the environment variables');
        }
        const connectionString = `${process.env.URL}/${DB_NAME}`;

        await mongoose.connect(connectionString);

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

export default connect;
