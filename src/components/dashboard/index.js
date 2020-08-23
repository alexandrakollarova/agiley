import React from 'react'
import DashboardNav from './dashboard-nav'
import {
  makeStyles,
  Grid,
  Container,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import ProgressCard from './progress-card'
import ProjectsCard from './projects-card'
import HelloCard from './hello-card'
import StatsCard from './stats-card'
import GraphCard from './graph-card'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  h5: {
    fontWeight: 500
  }
}))

const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      title
    }
  }
`

const GET_SECTIONS = gql`
  query {
    getSections {
      id
      title
      label
      pos
      description
      projectId
      cards {
        id
        title
        label
        description
        pos
      }
    }
  }
`

export default function Dashboard() {
  const classes = useStyles()
  const desktop = useMediaQuery('(min-width:1000px)')

  // QUERIES
  const { loading: loadingSections, error: errorSections, data: dataSections } = useQuery(GET_SECTIONS)
  const { loading: loadingProjects, error: errorProjects, data: dataProjects } = useQuery(GET_PROJECTS)

  if (loadingSections) return 'Loading...'
  if (errorSections) return `Error! ${errorSections.message}`
  if (loadingProjects) return 'Loading...' // replace with Material UI spinner
  if (errorProjects) return `Error! ${errorProjects.message}`

  function getOverallProgress() {
    let sumTodo = 0
    let sumInProgress = 0
    let sumDone = 0

    dataSections.getSections.map(section => {
      if (section.label === 'todo') sumTodo = sumTodo + section.cards.length
      else if (section.label === 'in progress') sumInProgress = sumInProgress + section.cards.length
      else if (section.label === 'done') sumDone = sumDone + section.cards.length
    })

    let total = sumTodo + sumInProgress + sumDone
    return (100 * sumDone) / total
  }

  function getNumOfCompletedProjects() {
    let completedProjects = 0

    dataProjects.getProjects.map(project => {
      let sumTodo = 0
      let sumInProgress = 0
      let sumDone = 0

      dataSections.getSections.map(section => {
        if (project.id === section.projectId) {
          if (section.label === 'todo') sumTodo = sumTodo + section.cards.length
          else if (section.label === 'in progress') sumInProgress = sumInProgress + section.cards.length
          else if (section.label === 'done') sumDone = sumDone + section.cards.length
        }
      })
      if (sumTodo === 0 && sumInProgress === 0 && sumDone > 0) completedProjects++
    })
    return completedProjects
  }

  return (
    <>
      <DashboardNav />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.h5}>dashboard</Typography>
          </Grid>
          <Grid item xs={desktop ? 6 : 12}>
            <HelloCard progress={getOverallProgress()} />
          </Grid>
          <Grid item xs={desktop ? 3 : 6}>
            <StatsCard numOfProjects={dataProjects.getProjects.length} completedProjects={getNumOfCompletedProjects()} />
          </Grid>
          <Grid item xs={desktop ? 3 : 6}>
            <ProgressCard progress={getOverallProgress()} />
          </Grid>
          <Grid item xs={desktop ? 8 : 12}>
            <GraphCard sections={dataSections.getSections} projects={dataProjects.getProjects} />
          </Grid>
          <Grid item xs={desktop ? 4 : 12}>
            <ProjectsCard projects={dataProjects.getProjects} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
