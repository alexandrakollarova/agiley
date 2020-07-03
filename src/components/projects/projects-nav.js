import React from 'react'
import { NavLink } from "react-router-dom"

export default function ProjectsNav(props) {
  return (
    <header>
      <nav>
        <ul>
          <NavLink to='/' className='logo'>agiley</NavLink>
          {props.path !== '/demo-project'
            && <NavLink to='/demo-project' className='demo-nav-li'>+ add project</NavLink>
          }
          <NavLink to='/' className='demo-nav-li'>home</NavLink>
        </ul>
      </nav>
    </header>
  )
}