import React from 'react'
import { Draggable } from 'react-smooth-dnd'
import {
  Typography,
  makeStyles,
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: 10,
    position: 'relative',
    padding: theme.spacing(1),
    cursor: 'grab',
    maxWidth: 300,
    marginBottom: theme.spacing(1),
    minWidth: 280,
    background: 'white'
  },
  subtitle1: {
    color: theme.palette.grey.main
  }
}))

export default function Card({ card }) {
  const classes = useStyles()
  return (
    <Draggable key={card.id}>
      <Box className={classes.card}>
        <Typography variant='subtitle1' className={classes.subtitle1}>{card.title}</Typography>
      </Box>
    </Draggable>
  )
}


