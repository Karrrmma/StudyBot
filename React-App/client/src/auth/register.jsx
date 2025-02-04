import { useState } from "react";

import {useNavigate} from 'react-router-dom'

function Register(){
    const navigate = useNavigate();
    const[username, setUsername] =useState('')
    const[password, setPassword] = useState('')
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch('/api/register',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',

                },
                body:JSON.stringify({username, password})

            }
            )
            if(response.ok){
                console.log('registered')
                navigate('/')
            }
            else{
                console.log('unable to register')
            }

        }
        catch(error){
            console.log(error,'unable to register')

        }


    }
    const handleClick=()=>{
        navigate('/')
    }
    




    return(
        <>
            <form onSubmit={handleSubmit}>

                
                <div  className="container">
                    <h1 className="reister"> register </h1>
                    <input 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}

                    placeholder='username'></input>
                    <h1 className="password"> Password</h1>
                    <input 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        
                        placeholder="password"></input>
                    <button type="submit">click here</button>
                </div>
            </form>
            <button onClick={handleClick}> click here to go login if you  have account </button>

        </>
    )
    
}

export default Register