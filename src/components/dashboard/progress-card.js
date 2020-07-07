import React from 'react'
import {
  makeStyles,
  CircularProgress,
  Typography,
  Box,
  Card
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'grey'
  },
  top: {
    color: 'black',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0
  },
  circle: {
    strokeLinecap: 'round'
  }
}))


export default function ProgressCard() {
  const classes = useStyles()
  const [progress, setProgress] = React.useState(67)

  return (
    <Card className={classes.card}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="static"
          className={classes.bottom}
          size={150}
          thickness={5}
          classes={{
            circle: classes.circle,
          }}
          value={100}
        />
        <CircularProgress
          variant="static"
          //disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={150}
          thickness={5}
          value={progress}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            progress,
          )}%`}</Typography>
        </Box>
      </Box>
    </Card>
  )
}
