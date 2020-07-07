import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
  makeStyles,
  Grid,
  Card,
  Container,
  CircularProgress,
  Typography,
  Box,
  InputBase
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    textAlign: 'left',
    background: theme.palette.greyish.main,
    borderRadius: 10,
    padding: theme.spacing(2),
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: 'none'
  },
  list: {
    borderRadius: 10,
    padding: theme.spacing(2),
    marginBlockStart: 0,
    marginBlockEnd: 0
  },
  h6: {
    color: theme.palette.blue.main,
    background: 'white',
    padding: theme.spacing(1),
    borderRadius: 10
  },
  input: {
    border: 'none',
    padding: theme.spacing(1),
    borderRadius: 10,
    //background: 'inherit',
    fontWeight: 700,
    outline: 'none'
  }
}))

const GET_PROJECTS = gql`
    {
      projects {,
        id,
        title
      }
    }
  `

const ADD_PROJECT = gql`
    mutation AddProject($type: String!) {
      addProject(title: $type) {
        id,
        title
      }
    }
  `

export default function ProjectsCard() {
  const classes = useStyles()
  let input
  const { loading, error, data } = useQuery(GET_PROJECTS)
  const [addProject] = useMutation(
    ADD_PROJECT,
    {
      update(cache, { data: { addProject } }) {
        const { projects } = cache.readQuery({ query: GET_PROJECTS });
        cache.writeQuery({
          query: GET_PROJECTS,
          data: { projects: projects.concat([addProject]) }
        })
      }
    }
  )

  if (loading) return 'Loading...' // replace with Material UI spinner
  if (error) return `Error! ${error.message}`

  function handleSubmit(e) {
    e.preventDefault()
    let title = e.target.title.value
    addProject({ variables: { type: title } })
    input.value = ''
  }

  return (
    <Card className={classes.card}>
      <ul className={classes.list}>
        {
          data.projects.map(({ id, title }) => {
            return (
              <li key={id}>
                <Link to={{
                  pathname: `/dashboard/${id}`,
                  state: { id, title }
                }}>
                  <Typography variant="h6" className={classes.h6}>{title}</Typography>
                </Link>
              </li>
            )
          })
        }
      </ul>

      <div>
        <form onSubmit={handleSubmit}>
          <InputBase
            className={classes.input}
            placeholder='Create a project..'
            //inputProps={{ 'aria-label': 'naked' }}
            ref={node => {
              input = node;
            }}
          />
        </form>
      </div>
    </Card>
  )
}
