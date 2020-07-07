import React from 'react'
import {
  makeStyles,
  Card,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    background: theme.palette.orange.main
  }
}))

export default function HelloCard() {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      hello
    </Card>
  )
}
