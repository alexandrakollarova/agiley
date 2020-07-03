import React from 'react'
import LandingNav from './landing-nav'
import LandingMain from './landing-main'
import LandingFooter from './landing-footer'
import './index.css'

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <LandingMain />
      <LandingFooter />
    </>
  )
}