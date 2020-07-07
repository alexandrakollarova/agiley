import React from 'react'
import {
  makeStyles,
  Card,
  Typography,
  Grid
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    background: theme.palette.orange.main,
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buffer: {
    padding: theme.spacing(4)
  },
  h6: {
    color: 'white',
  },
  body1: {
    color: 'white'
  }
}))

export default function HelloCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <div className={classes.buffer}>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h6" className={classes.h6}>
              Welcome back!
            </Typography>
            <Typography variant="body1" className={classes.body1}>
              You've made % progress of your goal this week.
              Keep it up!
            </Typography>
          </Grid>
          <Grid item xs={3}>
            illustration
          </Grid>
        </Grid>

      </div>
    </Card>
  )
}
