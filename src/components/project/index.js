import React from 'react'
import { useLocation } from 'react-router-dom'
import Board from 'react-trello'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import ProjectNav from './project-nav'
import './index.css'

const GET_PROJECT = gql`
query Project($type: ID!) {
  project(id: $type) {
    title,
    lists {
      id
      title,
      cards {
        id
        title,
        content
      }
    }
  }
}
  `

export default function Project() {
  const location = useLocation()
  const projectId = location.state.id
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { type: projectId }
  })

  let boardData = data && { lanes: data.project.lists }

  if (loading) return 'Loading...' // replace with Material UI spinner
  if (error) return `Error! ${error.message}`

  return (
    <div>
      <ProjectNav />

      <div className='project-item-title'>
        <h2>{data && data.project.title}</h2>
      </div>

      <main className="project-item-main">
        {data && <Board data={boardData} editable />}
      </main>

      {/* <div className='scrum-board2-wrapper'>
        <img src={scrumBoard2} alt="scrum-board" className="scrum-board2" />
      </div> */}
    </div>
  )
}

