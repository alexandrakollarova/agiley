import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
  makeStyles,
  List,
  ListItem,
  Card,
  Typography,
  InputBase
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  card: {
    textAlign: 'left',
    background: theme.palette.greyGradient.main,
    borderRadius: 10,
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)'
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
    outline: 'none',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  link: {
    width: '100%'
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
        success,
        message
      }
    }
  `

export default function ProjectsCard() {
  const classes = useStyles()
  let input
  const [title, setTitle] = useState('')
  const { loading, error, data } = useQuery(GET_PROJECTS)
  const [addProject] = useMutation(
    ADD_PROJECT,
    {
      update(cache, { data: { addProject } }) {
        const projects = cache.readQuery({ GET_PROJECTS });
        cache.writeQuery({
          GET_PROJECTS,
          data: { projects: projects.concat([addProject]) }
        })
      }
    }
  )

  if (loading) return 'Loading...' // replace with Material UI spinner
  if (error) return `Error! ${error.message}`

  function handleSubmit(e) {
    // e.preventDefault()
    // setTitle(e.target.value)
    //let title = e.target.title.value
    addProject({ variables: { type: title } })
    input.value = ''
  }

  return (
    <Card className={classes.card}>
      <List className={classes.list}>
        {
          data.projects.map(({ id, title }) => {
            return (
              <ListItem key={id} className={classes.listItem}>
                <Link
                  className={classes.link}
                  to={{
                    pathname: `/dashboard/${id}`,
                    state: { id, title }
                  }}>
                  <Typography variant="h6" className={classes.h6}>{title}</Typography>
                </Link>
              </ListItem>
            )
          })
        }
      </List>

      <div>
        <form onSubmit={handleSubmit}>
          <InputBase
            className={classes.input}
            placeholder='Create a project..'
            value={title}
            onChange={e => setTitle(e.target.value)}
            ref={node => input = node}
          />
        </form>
      </div>
    </Card>
  )
}
