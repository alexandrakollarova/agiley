import React from 'react'
import { Link } from 'react-router-dom'
import LandingNav from './landing-nav'
import {
  Typography,
  makeStyles,
  Grid
} from '@material-ui/core'
import workflow from '../../images/workflow.jpg'

const useStyles = makeStyles(theme => ({
  headline: {
    color: '#282EBA',
    fontWeight: 700,
    float: 'right'
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
    width: 650
  },
  bgImageWrapper: {
    width: 650,
  }
}))

export default function LandingPage() {
  const classes = useStyles()
  return (
    <>
      <LandingNav />
      <Grid
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={5}>
          <Typography variant="h2" className={classes.headline}>
            Track small
            <br />to large scale
            <br />projects.
          </Typography>
        </Grid>
        <Grid item xs={7} className={classes.bgImageWrapper}>
          <img src={workflow} alt="workflow" className={classes.bgImage} width={650} />
        </Grid>
      </Grid>
      <div className={classes.footerWrapper}>
        <Link to='/dashboard' className={classes.exploreBtn}>EXPLORE VISBO</Link>
        <Typography variant="h6" className={classes.h6}>Easy, flexible and free.</Typography>
      </div>
      <footer className={classes.footer} />
    </>
  )
}