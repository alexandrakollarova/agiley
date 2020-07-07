import React from 'react'
import { NavLink } from "react-router-dom"

export default function ProjectNav() {
  return (
    <header>
      <nav>
        <ul>
          <NavLink to='/' className='logo'>agiley</NavLink>
          <NavLink to='/dashboard' className='landing-nav-li demo'>dashboard</NavLink>
          <NavLink to='/' className='demo-nav-li'>home</NavLink>
        </ul>
      </nav>
    </header>
  )
}