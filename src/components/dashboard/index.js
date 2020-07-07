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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    height: '100%',
  },
  h5: {
    fontWeight: 500
  }
}))

export default function Dashboard() {
  const classes = useStyles()
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
            <ProgressCard />
          </Grid>
          <Grid item xs={8}>
            <GraphCard />
          </Grid>
          <Grid item xs={4}>
            <ProjectsCard />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
