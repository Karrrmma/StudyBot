import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Studybot from './study.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='studybot'>
        <h1 > Study Bot</h1>
        <Studybot/>

      </div>
    </>
  )
}

export default App
