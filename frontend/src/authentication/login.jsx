import React, {useState} from "react";

import { useNavigate } from "react-router-dom";
function Login(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = await fetch('/login',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
            
            body:JSON.stringify({username, password})
        })
        if(response.ok){
            const result = await response.json()
           
            localStorage.setItem('token',result.token);
            console.log('log in',result.token)
            console.log(result.token)
            navigate('/chat')

        }
        else{
            console.log('error loggin in')
        }
          
        }
        catch(error){
            console.log(error, ' not loggingin in')
        }
    }







    return(
        <>
       <h1> Hello</h1>
       <form  onSubmit={handleSubmit}>
        <p > Username</p>
        <input onChange={(e)=> setUsername(e.target.value)}
        placeholder="username"></input>
        <p> password</p>
        <input onChange={(e)=>setPassword(e.target.value)}
        type="password"></input>
        <br/>
        <br/>
        <button> CLick here to log in</button>

       </form>
       <br/>
       <button onClick={()=> navigate('/registration')}>click here to register</button>
        
        
        
        
        </>
    )
}

export default Login;