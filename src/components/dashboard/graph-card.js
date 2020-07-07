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

export default function GraphCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      graph
    </Card>
  )
}
