import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import naruto from '../assets/naruto.jpg'
import { io } from "socket.io-client";

function Chat(){
    const navigate = useNavigate();
    const[message, setMessage] = useState('')
    const[messages, setMessages] = useState([])
   
    
    const[socket, setSocket]= useState(null)

    const[username, setUsername] = useState()

    function handleCLick(){
        
        console.log('navigate back')
        //e.preventDefault()
        navigate('/');

    }

    useEffect(()=>{
        const token = localStorage.getItem('token');


        if (!token) {
            console.error('No token found');
            navigate('/login');
            return;
        }


        fetchMessage(token);

        const newSocket = io('http://localhost:5000',{
            auth:{
                token,
            },
        });
        setSocket(newSocket)
        newSocket.on('connect', () => {
            console.log('Connected to Socket.io server');
        });
        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        newSocket.on('PreviousMessages', (msgs)=>{
            setMessages(msgs);
        }); 

        newSocket.on('chatMessage', (msg)=>{
            console.log('Received broadcasted message:', msg);
            setMessages((prevMessages)=>[...prevMessages, msg]);
        });
        return()=>{
            newSocket.disconnect();
        };
    },[navigate]);








    const fetchMessage = async (token)=>{
      
    
        try{
            console.log('Token before fetch:', token); 


            const response = await fetch('/chat',{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type': 'application/json'

                }


            });
            if (response.ok){
                const data = await response.json()
                console.log('Fetched messages:', data);

                setMessages(data)
            }
            else{
                console.error('failed to fetch message', response.statusText)
            }

        }
        catch(error){
            console.error("error", error)

        }

    }
    const  postMessage = async (token) =>{
        try{
            const response = await fetch('/chat',{
                method:'POST',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json',

            },
            body:JSON.stringify({chat:message})

            })
            if(response.ok){
                console.log('Message posted successfully');
            } else {
                console.error('Failed to post message:', response.statusText);
            }
            

        }
        catch(error){
            throw error
        }

    } 

    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            navigate('/');
            return;
        }

        if(socket){
            // Sending a 'chatMessage' event to the server

            socket.emit('chatMessage', message);
            await postMessage(token);
            setMessage('');
        }
        else{
            console.log('socket is not connected ')
        }
    };





    return(
        <>
            <div className="textbox">
                <h1> ChatRoom</h1>
                <img src={naruto} alt="Naruto"/>
                <div>
                    {messages.map((msg, index)=>(
                        <div key={index} > 
                             {/* Check if sendby is defined and safely access the username */}
                        <strong>{msg.sendby ? msg.sendby.username : "Unknown"}:</strong> {msg.chat}
                    </div>
                       
                    ))}

                </div>

                <input 
                    type="text"
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
                    placeholder="type a message..."

                />
                <button onClick={sendMessage}> Send message</button>

            </div>
            
            
            <button onClick={handleCLick}> Here to go to APP</button>
        </>
    )
}

export default Chat;