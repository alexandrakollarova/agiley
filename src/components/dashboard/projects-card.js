import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
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
  query {
    getProjects {
      id
      title
    }
  }
`

const PROJECT_SUBSCRIPTION = gql`
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

export default function ProjectsCard() {
  const classes = useStyles()
  const [addProjectInputText, setAddProjectInputText] = useState('')
  const [projects, setProjects] = useState([])
  const [AddProject, { insertProject }] = useMutation(ADD_PROJECT)
  const { loading, error, data } = useQuery(GET_PROJECTS)

  useEffect(() => {
    if (data) {
      setProjects(data.getProjects)
    }
  }, [data])

  const { data: { projectAdded } = {} } = useSubscription(PROJECT_SUBSCRIPTION)

  useEffect(() => {
    if (projectAdded) {
      setProjects(projects.concat(projectAdded))
    }
  }, [projectAdded, projects])

  const onAddProjectSubmit = () => {
    if (addProjectInputText) {
      AddProject({
        variables: {
          title: addProjectInputText
        }
      })
    }
  }

  return (
    <Card className={classes.card}>
      <List className={classes.list}>
        {
          data && data.getProjects.map(({ id, title }) => {
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
        <form onSubmit={onAddProjectSubmit}>
          <InputBase
            className={classes.input}
            placeholder='Create a project...'
            onChange={e => setAddProjectInputText(e.target.value)}
          />
        </form>
      </div>
    </Card>
  )
}
