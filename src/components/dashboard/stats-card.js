import React from 'react'
import {
  makeStyles,
  Card,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.greyGradient.main
  },
  buffer: {
    textAlign: 'center'
  },
  h2: {
    background: theme.palette.blueGradient.main,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    fontWeight: 500,
    fontSize: 70
  }
}))

export default function StatsCard({
  numOfProjects,
  completedProjects
}) {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <div className={classes.buffer}>
        <Typography variant="h2" className={classes.h2}>
          {completedProjects}
          /
          {numOfProjects}
        </Typography>
        <Typography variant="subtitle1">
          completed
        </Typography>
      </div>
    </Card>
  )
}
