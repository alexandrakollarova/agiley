import React from 'react'
import {
  makeStyles,
  Card,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
  }
}))

export default function StatsCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      stats
    </Card>
  )
}
