import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { IoIosAdd } from 'react-icons/io'
import { Container } from 'react-smooth-dnd'
import CardContainer from '../../cards/cards-container'
import ProjectNav from '../project-nav'
import './index.css'
import sortBy from 'lodash/sortBy'
import PosCalculation from '../../../utils/pos_calculation'
import workflow from '../../../images/workflow2.jpg'
import {
  makeStyles
} from '@material-ui/core'

import {
  BoardContainer,
  CardHorizontalContainer,
  AddSectionDiv,
  AddSectionForm,
  AddSectionLink,
  AddSectionLinkSpan,
  AddSectionLinkIconSpan,
  AddSectionInput,
  ActiveAddSectionInput,
  SubmitCardButtonDiv,
  SubmitCardButton,
  SubmitCardIcon,
} from './board.styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  bgImage: {
    width: 300
  }
}))


const GET_SECTIONS_BY_PROJECT_ID = gql`
  query getSectionsByProjectId($projectId: ID!) {
    getSectionsByProjectId(request: { projectId: $projectId}) {
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

const SECTION_ADDED = gql`
  subscription {
    sectionAdded {
      id
      title
      label
      description
      pos
      cards {
        id
        title
        label
        pos
        description
      }
    }
  }
`

const ADD_SECTION = gql`
  mutation AddSection($title: String!, $label: String!, $pos: Int!, $projectId: ID!) {
    insertSection(request: { title: $title, label: $label, pos: $pos, projectId: $projectId }) {
      title
      description
      label
    }
  }
`

const UPDATE_SECTION_POS = gql`
  mutation UpdateSection($sectionId: String!, $pos: Int!) {
    updateSectionPos(request: { sectionId: $sectionId, pos: $pos }) {
      id
      pos
    }
  }
`

const ON_SECTION_POS_CHANGE = gql`
  subscription {
    onSectionPosChange {
      id
      pos
    }
  }
`

export default function Project() {
  const classes = useStyles()
  const location = useLocation()
  const projectId = location.state.id
  const projectTitle = location.state.title

  const [isAddSectionInputActive, setAddSectionInputActive] = useState(false)
  const [addSectionInputText, setAddSectionInputText] = useState('')
  const [sections, setSections] = useState([])

  // QUERIES
  const { loading, error, data } = useQuery(GET_SECTIONS_BY_PROJECT_ID, {
    variables: { projectId }
  })

  // MUTATIONS
  const [AddSection] = useMutation(ADD_SECTION)
  const [updateSectionPos] = useMutation(UPDATE_SECTION_POS)

  // SUBSCRIPTIONS
  const { data: { sectionAdded } = {} } = useSubscription(SECTION_ADDED)
  const { data: { onSectionPosChange } = {} } = useSubscription(ON_SECTION_POS_CHANGE)

  useEffect(() => {
    if (data) {
      setSections(data.getSectionsByProjectId)
    }
  }, [data])

  useEffect(() => {
    if (sectionAdded) {
      setSections(sections.concat(sectionAdded))
      setAddSectionInputActive(false)
    }
  }, [sectionAdded])

  useEffect(() => {
    if (onSectionPosChange) {
      let newSections = sections
      newSections = newSections.map(section => {
        if (section.id === onSectionPosChange.id) {
          return { ...section, pos: onSectionPosChange.pos }
        } else {
          return section
        }
      })

      let sortedSections = sortBy(newSections, [
        (section) => section.pos
      ])
      setSections(sortedSections)
    }
  }, [onSectionPosChange])

  function onColumnDrop({ removedIndex, addedIndex, payload }) {
    if (data) {
      let updatePOS = PosCalculation(
        removedIndex,
        addedIndex,
        sections
      )

      let newSections = sections.map(section => {
        if (section.id === payload.id) {
          return { ...section, pos: updatePOS }
        } else {
          return section
        }
      })

      let sortedSections = sortBy(newSections, [
        (section) => section.pos
      ])

      updateSectionPos({
        variables: {
          sectionId: payload.id,
          pos: parseInt(updatePOS)
        }
      })
      setSections([...sortedSections])
    }
  }

  function onAddSectionSubmit(e) {
    e.preventDefault()

    if (addSectionInputText) {
      AddSection({
        variables: {
          title: addSectionInputText,
          label: addSectionInputText,
          pos:
            sections && sections.length > 0
              ? sections[sections.length - 1].pos + 16384
              : 16384,
          projectId: projectId
        }
      })
    }
  }

  return (
    <div>
      <ProjectNav />

      <div className='project-item-title'>
        <h2>{projectTitle}</h2>
      </div>

      <Container
        orientation={'horizontal'}
        onDrop={onColumnDrop}
        getChildPayload={index => sections[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'cards-drop-preview'
        }}
      >
        {sections.length > 0 &&
          sections.map((section, index) => <CardContainer key={index} section={section} sections={sections} />)
        }
      </Container>
      <AddSectionDiv onClick={() => setAddSectionInputActive(true)}>
        <AddSectionForm>
          {isAddSectionInputActive ? (
            <React.Fragment>
              <ActiveAddSectionInput
                onChange={e => setAddSectionInputText(e.target.value)}
              />
              <SubmitCardButtonDiv>
                <SubmitCardButton
                  type='button'
                  value='Add Card'
                  onClick={onAddSectionSubmit}
                />
                <SubmitCardIcon>
                  <IoIosAdd />
                </SubmitCardIcon>
              </SubmitCardButtonDiv>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <AddSectionLink>
                  <AddSectionLinkSpan>
                    <IoIosAdd size={28} />
                  Add another list
                </AddSectionLinkSpan>
                </AddSectionLink>
                <AddSectionInput />
              </React.Fragment>
            )}
        </AddSectionForm>
      </AddSectionDiv>
      <div>
        <img src={workflow} alt="workflow" className={classes.bgImage} />
      </div>
    </div>
  )
}

