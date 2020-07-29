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

const GET_LISTS = gql`
    {
      projects {
        id
        title
        lists {
          id
          title
          cards {
            id
            title
          }
        }
      }
    }
  `

export default function Dashboard() {
  const classes = useStyles()
  const { loading, error, data } = useQuery(GET_LISTS)

  if (loading) return 'Loading...' // replace with Material UI spinner
  if (error) return `Error! ${error.message}`

  function getOverallProgress() {
    let sumTodo = 0
    let sumInProgress = 0
    let sumDone = 0

    const projectLists = data.projects.map(project => project.lists)

    projectLists.map(lists => {
      return lists.map(list => {
        if (list.title === 'Todo') {
          sumTodo = sumTodo + list.cards.length
        }
        else if (list.title === 'In-progress') {
          sumInProgress = sumInProgress + list.cards.length
        }
        else if (list.title === 'Done') {
          sumDone = sumDone + list.cards.length
        }
      })
    })

    let total = sumTodo + sumInProgress + sumDone

    return (100 * sumDone) / total
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
            <GraphCard projects={data.projects} />
          </Grid>
          <Grid item xs={4}>
            <ProjectsCard />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
