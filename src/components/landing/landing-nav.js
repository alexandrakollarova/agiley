import React from 'react'
import { NavLink } from "react-router-dom"
import {
  makeStyles,
  AppBar,
  Toolbar,
} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: 'transparent',
    color: '#282EBA',
    fontWeight: 600,
    boxShadow: 'none'
  },
  logo: {
    flexGrow: 1
  },
  demo: {
    '&:hover': {
      borderBottom: '3px solid #FF911E'
    }
  }
})

export default function LandingNav() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <NavLink to='/' className={classes.logo}>agiley</NavLink>
          <NavLink to='/dashboard' className={classes.demo}>demo</NavLink>
        </Toolbar>
      </AppBar>
    </div>
  )
}