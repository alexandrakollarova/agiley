import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { IoIosAdd } from "react-icons/io"
import { Container } from 'react-smooth-dnd'
import CardContainer from "./Cards/CardsContainer"
import ProjectNav from './project-nav'
import './index.css'
import sortBy from "lodash/sortBy"
import PosCalculation from '../../utils/pos_calculation'
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
} from "./board.styles"

const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      sections {
        id
      }
    }
  }
`

const GET_SECTIONS_BY_ID = gql`
  query GetSectionsById($ids: [ID]!) {
    getSectionsById(ids: $ids) {
      id
      title
      label
      pos
      description
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
  mutation AddSection($id: ID!, $title: String!, $label: String!, $pos: Int!) {
    insertSection(request: { id: $id, title: $title, label: $label, pos: $pos }) {
      title
      description
      id
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

const ON_SECTION_POS_CHANGES = gql`
  subscription {
    onSectionPosChange {
      id
      pos
    }
  }
`

export default function Project() {
  const location = useLocation()
  const projectId = location.state.id
  const projectTitle = location.state.title

  const [isAddSectionInputActive, setAddSectionInputActive] = useState(false)
  const [addSectionInputText, setAddSectionInputText] = useState('')
  const [sections, setSections] = useState([])

  // QUERIES
  const GetProjectById = useQuery(GET_PROJECT_BY_ID, {
    variables: {
      id: projectId
    }
  })
  const [GetSectionsById, { data }] = useLazyQuery(GET_SECTIONS_BY_ID)

  // MUTATIONS
  const [AddSection, { insertSection }] = useMutation(ADD_SECTION)
  const [updateSectionPos] = useMutation(UPDATE_SECTION_POS)

  // SUBSCRIPTIONS
  const { data: { sectionAdded } = {} } = useSubscription(SECTION_ADDED)
  const { data: { onSectionPosChange } = {} } = useSubscription(ON_SECTION_POS_CHANGES)

  useEffect(() => {
    if (!GetProjectById.loading && GetProjectById.data !== '') {
      const ids = GetProjectById.data.getProjectById.sections.map(section => section.id)

      GetSectionsById({ variables: { ids } })

      if (data) {
        setSections(data.getSectionsById)
      }
    }
  }, [GetProjectById, GetSectionsById, data])

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
        (section) => {
          return section.pos
        }
      ])
      setSections(sortedSections)
    }
  }, [onSectionPosChange, sections])

  useEffect(() => {
    if (sectionAdded) {
      setSections(sections.concat(sectionAdded))
      setAddSectionInputActive(false)
    }
  }, [sectionAdded])

  function onColumnDrop({ removedIndex, addedIndex, payload }) {
    if (data) {
      let updatePOS = PosCalculation(
        removedIndex,
        addedIndex,
        data.fetchSections
      )
      let newSections = sections.map(section => {
        if (section.id === payload.id) {
          return { ...section, pos: updatePOS }
        } else {
          return section
        }
      })

      let sortedSections = sortBy(newSections, [
        (section) => {
          return section.pos
        }
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
          id: projectId,
          title: addSectionInputText,
          label: addSectionInputText,
          pos:
            sections && sections.length > 0
              ? sections[sections.length - 1].pos + 16384
              : 16384
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
        orientation={"horizontal"}
        onDrop={onColumnDrop}
        onDragStart={() => {
          console.log("on drag start")
        }}
        getChildPayload={(index) => {
          return sections[index]
        }}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "cards-drop-preview",
        }}
      >
        {sections.length > 0 &&
          sections.map((item, index) => (
            <CardContainer item={item} key={index} sections={sections} />
          ))}
      </Container>
      <AddSectionDiv onClick={() => setAddSectionInputActive(true)}>
        <AddSectionForm>
          {isAddSectionInputActive ? (
            <React.Fragment>
              <ActiveAddSectionInput
                onChange={(e) => setAddSectionInputText(e.target.value)}
              />
              <SubmitCardButtonDiv>
                <SubmitCardButton
                  type="button"
                  value="Add Card"
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
      {/* <div className='scrum-board2-wrapper'>
        <img src={scrumBoard2} alt="scrum-board" className="scrum-board2" />
      </div> */}
    </div>
  )
}

