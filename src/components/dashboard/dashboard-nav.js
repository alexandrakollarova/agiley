import React from 'react'
import { NavLink } from "react-router-dom"

export default function DashboardNav(props) {
  return (
    <header>
      <nav>
        <ul>
          <NavLink to='/' className='logo'>visbo</NavLink>
          {props.path !== '/demo-project'
            && <NavLink to='/demo-project' className='demo-nav-li'>+ Add Project</NavLink>
          }
          <NavLink to='/' className='demo-nav-li'>Home</NavLink>
        </ul>
      </nav>
    </header>
  )
}