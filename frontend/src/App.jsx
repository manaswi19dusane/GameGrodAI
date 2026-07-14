import { useState } from 'react'

import './App.css'

import GameGuardAI from './GameGuardAI'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameGuardAI />
    </>
  )
}

export default App
