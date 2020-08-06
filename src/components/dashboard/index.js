import React from 'react'
import DashboardNav from './dashboard-nav'
import {
  makeStyles,
  Grid,
  Container,
  Typography
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

  // QUERIES
  const { loading: loadingProjects, error: errorProjects, data: dataProjects } = useQuery(GET_PROJECTS)
  const { loading: loadingSections, error: errorSections, data: dataSections } = useQuery(GET_SECTIONS)

  if (loadingSections) return 'Loading...' // replace with Material UI spinner
  if (errorSections) return `Error! ${errorSections.message}`

  function getOverallProgress() {
    let sumTodo = 0
    let sumInProgress = 0
    let sumDone = 0

    dataSections.getSections.map(section => {
      if (section.label === 'todo') {
        sumTodo = sumTodo + section.cards.length
      }
      else if (section.label === 'in progress') {
        sumInProgress = sumInProgress + section.cards.length
      }
      else if (section.label === 'done') {
        sumDone = sumDone + section.cards.length
      }
    })

    let total = sumTodo + sumInProgress + sumDone
    return (100 * sumDone) / total
  }

  function getNumOfCompletedProjects() {

  }

  return (
    <>
      <DashboardNav />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.h5}>dashboard</Typography>
          </Grid>
          <Grid item xs={6}>
            <HelloCard />
          </Grid>
          <Grid item xs={3}>
            <StatsCard />
          </Grid>
          <Grid item xs={3}>
            <ProgressCard progress={getOverallProgress()} />
          </Grid>
          <Grid item xs={8}>
            <GraphCard projects={dataProjects.getProjects} sections={dataSections.getSections} />
          </Grid>
          <Grid item xs={4}>
            <ProjectsCard />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
