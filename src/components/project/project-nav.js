import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  makeStyles,
  AppBar,
  Toolbar,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: 'transparent',
    color: '#1631A4',
    fontWeight: 600,
    boxShadow: 'none'
  },
  logo: {
    flexGrow: 1
  },
  home: {
    '&:hover': {
      borderBottom: '3px solid #FF911E'
    },
    marginLeft: theme.spacing(2)
  }
}))

export default function ProjectNav() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <NavLink to='/' className={classes.logo}>agiley</NavLink>
          <NavLink to='/dashboard' className={classes.home}>dashboard</NavLink>
          <NavLink to='/' className={classes.home}>home</NavLink>
        </Toolbar>
      </AppBar>
    </div>
  )
}