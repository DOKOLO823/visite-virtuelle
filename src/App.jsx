import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VirtualTour from './VirtualTour'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VirtualTour />
    </>
  )
}

export default App
