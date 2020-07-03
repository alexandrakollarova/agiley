import React from 'react'
import { NavLink } from "react-router-dom"

export default function LandingNav() {
  return (
    <header>
      <nav>
        <ul>
          <NavLink to='/' className='logo'>agiley</NavLink>
          <NavLink to='/projects' className='landing-nav-li demo'>demo</NavLink>
        </ul>
      </nav>
    </header>
  )
}