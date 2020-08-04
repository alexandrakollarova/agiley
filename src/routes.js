import React from "react"
import { Switch, Route } from "react-router-dom"
import LandingPage from './components/landing'
import DashboardPage from './components/dashboard'
import ProjectPage from './components/project/index.js'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route path='/dashboard/:projectId' component={ProjectPage} />
    </Switch>
  )
}