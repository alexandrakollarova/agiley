import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
  makeStyles,
  List,
  ListItem,
  Card,
  Typography,
  InputBase,
  Box
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
    fontWeight: 700,
    outline: 'none',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  link: {
    width: '100%'
  }
}))

const PROJECT_ADDED = gql`
  subscription {
    projectAdded {
      id
      title
    }
  }
`

const ADD_PROJECT = gql`
  mutation AddProject($title: String!) {
    insertProject(request: { title: $title }) {
      title
      id
    }
  }
`

const ADD_INITIAL_SECTIONS = gql`
  mutation AddInitialSections($projectId: ID!) {
    addInitialSections(request: { projectId: $projectId }) {
      id
    }
  }
`

const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      title
    }
  }
`

const GET_SECTIONS = gql`
  query {
    getSections {
      id
      title
      label
      pos
      description
      projectId
      cards {
        id
        title
        label
        description
        pos
      }
    }
  }
`

export default function ProjectsCard({ projects: incomingProjects }) {
  const classes = useStyles()

  const [addProjectInputText, setAddProjectInputText] = useState('')
  const [projects, setProjects] = useState(incomingProjects)

  // MUTATIONS
  const [AddProject] = useMutation(ADD_PROJECT)
  const [AddInitialSections] = useMutation(ADD_INITIAL_SECTIONS)

  // SUBSCRPTIONS
  const { data: { projectAdded } = {} } = useSubscription(PROJECT_ADDED)

  useEffect(() => {
    if (projectAdded) {
      setProjects(projects.concat(projectAdded))
    }
  }, [projectAdded])

  function onAddProjectSubmit(e) {
    e.preventDefault()

    if (addProjectInputText) {
      AddProject({
        variables: {
          title: addProjectInputText
        },
        refetchQueries: [
          { query: GET_PROJECTS },
          { query: GET_SECTIONS }
        ]
      }).then(res => {
        AddInitialSections({
          variables: {
            projectId: res.data.insertProject.id
          }
        })
      })

      setAddProjectInputText('')
    }
  }

  return (
    <Card className={classes.card}>
      <List className={classes.list}>
        {projects.map(({ id, title }) => {
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
        })}
      </List>
      <Box>
        <form onSubmit={onAddProjectSubmit}>
          <InputBase
            className={classes.input}
            placeholder='Create a project...'
            onChange={e => setAddProjectInputText(e.target.value)}
            value={addProjectInputText}
          />
        </form>
      </Box>
    </Card>
  )
}
