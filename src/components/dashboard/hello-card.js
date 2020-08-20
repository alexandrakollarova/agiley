import React from 'react'
import {
  makeStyles,
  Card,
  Typography,
  Grid
} from '@material-ui/core'
import img from '../../images/programmer.png'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    background: theme.palette.yellow.main,
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buffer: {
    padding: theme.spacing(5, 0, 5, 5)
  },
  h6: {
    fontWeight: 700
  },
  subtitle1: {
    lineHeight: 1.5
  },
  img: {
    width: '100%'
  }
}))

export default function HelloCard({ progress }) {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <Grid
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={7} className={classes.buffer}>
          <Typography variant="h6" className={classes.h6}>
            Welcome back!
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle1}>
            You've made {progress ? Math.round(progress) : 0}% progress with your projects so far.
            <br />
              Keep it up!
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <img src={img} alt="programmer" className={classes.img} />
        </Grid>
      </Grid>
    </Card>
  )
}
