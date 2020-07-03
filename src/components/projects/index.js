import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectsNav from './projects-nav'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

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

export default function ProjectList(props) {
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
    <div className='project-list-wrapper'>
      <ProjectsNav path={props.match.path} />

      <div className='project-list-title'>
        <h2>Projects</h2>
      </div>

      <main className='project-list-main'>
        <ul className="project-list">
          {data.projects.map(({ id, title }) => {
            return (
              <li key={id}>
                <Link to={{
                  pathname: `/dashboard/${id}`,
                  state: { id, title }
                }}>
                  <h3>{title}</h3>
                </Link>
              </li>
            )
          })}
        </ul>

        <div>
          <form onSubmit={handleSubmit} className='add-project-form' >
            <label htmlFor='title'>
              <input
                ref={node => {
                  input = node;
                }}
                type='text'
                name='title'
                placeholder='Create a project..'
              />
            </label>
          </form>
        </div>
      </main>
    </div>
  )
}
