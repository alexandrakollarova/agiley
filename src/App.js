import React from "react"
import { Switch, Route } from "react-router-dom"
import LandingPage from './components/landing'
import DashboardPage from './components/dashboard'
import ProjectsPage from './components/projects'
import ProjectBoard from './components/project-board/index.js'

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/projects" component={ProjectsPage} />
      <Route exact path="/dashboard/:projectId" component={DashboardPage} />
      <Route path='/project/:projectId' component={ProjectBoard} />
    </Switch>
  )
}