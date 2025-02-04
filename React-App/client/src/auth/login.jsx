import { useState } from "react";
import {useNavigate} from 'react-router-dom'

function Login(){
    const navigate = useNavigate();
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    const handleSubmit= async(e)=>{
        e.preventDefault()
        try{
            const response = await fetch('/api/login',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({username, password})
            }
            )
            if (response.ok){
                console.log('logged in successfully')
                navigate('/studybot')
            }
        }
        catch(error){
            console.log('user or password incorrect')
        }

    }
    const handleClick=()=>{
        navigate('/register')
    }





    return(
        <>  <form onSubmit={handleSubmit}>

      
                <div  className="container">
                    <h1 className="Username"> log in </h1>
                    <input 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    
                    placeholder='Username'></input>
                    <h1 className="password"> Password</h1>
                    <input 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    placeholder="password"></input>
                    <button>click here</button>
                </div>
            </form>
            <button onClick={handleClick}> click here to go register if you dont have account </button>
        </>
    )
    
}

export default Login