import React, { useState } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./authentication/login";
import Registration from "./authentication/registration";
import Chat from "./authentication/chat";
function App(){
  const [token, setToken] = useState();
  if (!token){
    return(
      <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}> </Route>
          <Route path="/registration" element={<Registration/>}></Route>
          <Route path="/chat" element={<Chat/>}> </Route>

        </Routes>



      </Router>
      </>

    )
  }
  
  
  
  
  
 
}

export default App;