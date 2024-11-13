import Dotenv from 'dotenv';
import express from 'express';
import dbconnect from './db.js';
import http from 'http';
import { Server } from  'socket.io'
import loginRouter from './controllers/login.js'
import registrationRouter from './controllers/registration.js'
import messageRouter from './controllers/chat.js'
import cors from 'cors';


Dotenv.config();

dbconnect()

const app = express();
const server = http.createServer(app);


app.use(express.json())

app.use(cors());

//this is to allow socket.io to use the same server as the http server 
// creates a new socket.io instance that is linked to your HTTP server
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5174',
        methods:['GET', 'POST']
    }
});
io.on('connection', (socket)=>{
    console.log(`⚡: ${socket.id} user just connected!`);
    
    
   
    // Listening for the 'chatMessage' event from the client

    socket.on('chatMessage', (data) => {
        console.log('Messssssage received:', data);
        io.emit('chatMessage', data);  // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    })
})



app.use('/login',loginRouter)
app.use('/registration', registrationRouter)
app.use('/chat', messageRouter)









const port = process.env.PORT|| 5000


server.listen(port,()=>{

    console.log(`backendlive on {http://localhost:${port}}`)
}
)

