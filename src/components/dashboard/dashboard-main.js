import React from 'react'
import { Link } from 'react-router-dom'
import {
  makeStyles,
  Grid,
  Card
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {

  }
}))

export default function DashboardMain({
  id,
  title
}) {
  const classes = useStyles()
  return (
    <Grid container>
      <Grid container item>
        <Grid item xs={6}>
          <Card>hey</Card>
        </Grid>
        <Grid item xs={3}>
          <Card>hey</Card>
        </Grid>
        <Grid item xs={3}>
          <Card>hey</Card>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item xs={8}>
          <Card>hey</Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <Link to={`/project/${id}`}>
              <h3>{title}</h3>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}