import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingMain() {
  return (
    <main className='landing-main'>
      <div className='headline-img-wrapper'>
        {/* <div className='scrum-board-wrapper'>
          <img src={scrumBoard} alt="scrum-board-bg" className="scrum-board" />
        </div> */}

        <div className='landing-main-inner-wrapper'>
          <h1 className='headline'>Track small
            <br />to large scale
            <br />projects.
          </h1>
        </div>
      </div>
      <div className='footer-wrapper'>
        <Link to='/projects' className='btn btn-demo'>EXPLORE VISBO</Link>
        <h3>Easy, flexible and free.</h3>
      </div>
    </main>
  )
}