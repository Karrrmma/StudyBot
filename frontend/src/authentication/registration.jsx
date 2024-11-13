import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Registration(){

    const[username, setUsername] = useState('')
    const [password, setPassword]= useState('')
    const navigate = useNavigate()
    async function handleSubmit(e){
        e.preventDefault()
        try{
            const response = await fetch('/registration',{
                method:'POST',
                headers:{
                'Content-type':'application/json'},
                body:JSON.stringify({username, password})

            })
            if (response.ok){
                const result = await response.json()
                console.log(result, 'successfuly registered in')
                navigate('/')
            }

        }catch(error){
            console.log(error)

        }

    }




    return(
        <>
        <form onSubmit={handleSubmit}action="registration"> 
            <p>username</p>
            <input onChange={(e)=>setUsername(e.target.value)}
            placeholder="username"></input>
            <p>password</p>
            <input onChange={(e)=>setPassword(e.target.value)}
            placeholder="password"></input>
            <br/>
            <br/>
            <button> CLick here to register</button>
           
        
        </form>
        <br/>
        <button onClick={()=> navigate('/')}> Click here to log in </button>
            
        
        </>


    )
}

export default Registration;