import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './/auth/login.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './index.css'
import Register from './auth/register.jsx'
import Studybot from './study.jsx'


createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/studybot' element={<App/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
     

    </Routes>
  </Router>
);

