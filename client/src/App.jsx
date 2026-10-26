
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Budget from './pages/Budget.jsx'
import Behaviour from './pages/Behaviour.jsx'
import PreDecision from './pages/PreDecision.jsx'
export default function App(){
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/budget" element={<Budget/>}/>
        <Route path="/behaviour" element={<Behaviour/>}/>
        <Route path="/pre-decision" element={<PreDecision/>}/>
      </Routes>
    </BrowserRouter>
  )
}
