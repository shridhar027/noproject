
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Home', path: '/' },
  { label: 'Budget', path: '/budget' },
  { label: 'Behaviour', path: '/behaviour' },
  { label: 'Pre Decision', path: '/pre-decision' }
]

export default function Navbar(){
  const navigate = useNavigate()
  const location = useLocation()
  const pillRef = useRef(null)
  const hoverRef = useRef(null)
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(()=>{
    const idx = items.findIndex(i=> i.path===location.pathname)
    setActiveIndex(idx>=0? idx : 0)
  },[location.pathname])

  useEffect(()=>{
    if(!containerRef.current || !pillRef.current) return
    const buttons = containerRef.current.querySelectorAll('.nav-item')
    const activeBtn = buttons[activeIndex]
    if(activeBtn){
      const rect = activeBtn.getBoundingClientRect()
      const contRect = containerRef.current.getBoundingClientRect()
      pillRef.current.style.left = (activeBtn.offsetLeft) + 'px'
      pillRef.current.style.width = rect.width + 'px'
    }
  },[activeIndex])

  const handleHover = (e, idx)=>{
    if(!hoverRef.current || !containerRef.current) return
    const btn = e.currentTarget
    hoverRef.current.style.opacity = '1'
    hoverRef.current.style.left = btn.offsetLeft - 14 + 'px'
    hoverRef.current.style.width = (btn.offsetWidth + 28) + 'px'
    hoverRef.current.classList.add('grow')
  }
  const handleLeave = ()=>{
    if(!hoverRef.current) return
    hoverRef.current.style.opacity='0'
  }

  return (
    <div className="nav-wrap">
      <div className="nav-pill" ref={containerRef} onMouseLeave={handleLeave}>
        <div className="active-pill" ref={pillRef} id="activePill"></div>
        <div className="hover-lens" ref={hoverRef} id="hoverLens"></div>
        {items.map((item, idx)=>(
          <button key={item.path} className={`nav-item ${activeIndex===idx?'active':''}`}
            onMouseEnter={(e)=>handleHover(e, idx)}
            onClick={()=>navigate(item.path)}
          >{item.label}</button>
        ))}
      </div>
    </div>
  )
}
