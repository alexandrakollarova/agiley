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
  buffer: {
    padding: theme.spacing(3)
  },
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'rgba(227, 227, 227, 0.8)'
  },
  top: {
    color: theme.palette.purple.main,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0
  },
  circle: {
    strokeLinecap: 'round'
  }
}))


export default function ProgressCard({ progress }) {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <div className={classes.buffer}>
        <Box position="relative" display="inline-flex">
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
            <Typography variant="h5" component="div" color="textSecondary">{`${Math.round(
              progress,
            )}%`}</Typography>
          </Box>
        </Box>
      </div>
    </Card>
  )
}
