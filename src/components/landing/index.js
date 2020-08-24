import React from 'react'
import { Link } from 'react-router-dom'
import LandingNav from './landing-nav'
import {
  Typography,
  makeStyles,
  Grid,
  useMediaQuery
} from '@material-ui/core'
import workflow from '../../images/workflow.jpg'

const useStyles = makeStyles(theme => ({
  headline: {
    color: theme.palette.blue.main,
    fontWeight: 700,
    textAlign: 'center',
    [theme.breakpoints.up(800)]: {
      float: 'right',
      textAlign: 'left'
    }
  },
  h6: {
    color: 'white',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  exploreBtn: {
    borderRadius: 30,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.orange.main,
    color: 'white',
    fontWeight: 600
  },
  footerWrapper: {
    textAlign: 'center',
    position: 'fixed',
    bottom: 50,
    left: 0,
    right: 0,
  },
  footer: {
    position: 'fixed',
    bottom: -50,
    height: 250,
    left: 0,
    right: 0,
    background: theme.palette.purple.main,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    zIndex: -1
  },
  bgImage: {
    width: '100%',
    [theme.breakpoints.between(450, 800)]: {
      width: 400
    },
    [theme.breakpoints.between(800, 1000)]: {
      width: 500
    },
    [theme.breakpoints.up(1000)]: {
      width: 600
    }
  },
  wrapper: {
    textAlign: 'center',
    [theme.breakpoints.down(400)]: {
      marginTop: theme.spacing(5)
    },
    [theme.breakpoints.between(400, 450)]: {
      marginTop: theme.spacing(2)
    }
  }
}))

export default function LandingPage() {
  const classes = useStyles()
  const desktop = useMediaQuery('(min-width:800px)')

  return (
    <>
      <LandingNav />
      <Grid container alignItems='center'>
        {desktop ?
          (
            <>
              <Grid item xs={5}>
                <Typography variant="h2" className={classes.headline}>
                  Track small
                  <br />to large scale
                  <br />projects.
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <img
                  src={workflow}
                  alt="workflow"
                  className={classes.bgImage}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} className={classes.wrapper}>
                <Typography variant="h2" className={classes.headline}>
                  Track small
                  <br />to large scale
                  <br />projects.
                </Typography>
                <img
                  src={workflow}
                  alt="workflow"
                  className={classes.bgImage}
                />
              </Grid>
            </>
          )
        }
      </Grid>
      <div className={classes.footerWrapper}>
        <Link to='/dashboard' className={classes.exploreBtn}>EXPLORE AGILEY</Link>
        <Typography variant="h6" className={classes.h6}>Easy, flexible and free.</Typography>
      </div>
      <footer className={classes.footer} />
    </>
  )
}