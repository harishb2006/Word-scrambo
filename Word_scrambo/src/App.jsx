
import './App.css'
import Home from './components/Home'
import Game from './components/Game'
import { BrowserRouter,Route,Routes, } from 'react-router-dom'

function App() {
  

  return (
    <>
     <BrowserRouter>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
