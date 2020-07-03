import React from 'react'
import Board from 'react-trello'
import './index.css'

export default function ProjectItem() {
  const project = this.context.projects.find(p =>
    p.id === this.props.match.params.projectId
  )

  let data = project && { lanes: project.lanes }

  return (
    <div>
      {/* <Header /> */}

      <div className='project-item-title'>
        <h2>{project && project.title}</h2>
      </div>

      <main className="project-item-main">
        {data && <Board data={data} editable />}
      </main>

      {/* <div className='scrum-board2-wrapper'>
        <img src={scrumBoard2} alt="scrum-board" className="scrum-board2" />
      </div> */}
    </div>
  )
}

