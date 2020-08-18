import React from 'react'
import {
  makeStyles,
  CircularProgress,
  Typography,
  Box,
  Card
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    textAlign: 'center'
  },
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'rgba(229, 168, 63, 0.1)'
  },
  top: {
    color: theme.palette.orange.main,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0
  },
  circle: {
    strokeLinecap: 'round'
  },
  box: {
    marginTop: theme.spacing(2)
  }
}))


export default function ProgressCard({ progress }) {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <Box position="relative" display="inline-flex" className={classes.box}>
        <CircularProgress
          variant="static"
          className={classes.bottom}
          size={150}
          thickness={4}
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
          thickness={4}
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
          <Typography variant="h3">{Math.round(progress)}</Typography>
          <Typography variant="h6">%</Typography>
        </Box>
      </Box>
    </Card>
  )
}
