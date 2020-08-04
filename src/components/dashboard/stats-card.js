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
    alignItems: 'center'
  },
  buffer: {
    padding: theme.spacing(3)
  },
  h2: {
    background: theme.palette.gradient.main,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    fontWeight: 500
  }
}))

export default function StatsCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <div className={classes.buffer}>
        <Typography variant="h2" className={classes.h2}>
          0/2
        </Typography>
        <Typography variant="subtitle1">
          completed (hardcoded)
        </Typography>
      </div>
    </Card>
  )
}
