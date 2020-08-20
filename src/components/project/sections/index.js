import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Container } from 'react-smooth-dnd'
import CardContainer from '../cards/cards-container'
import ProjectNav from '../project-nav'
import './index.css'
import sortBy from 'lodash/sortBy'
import PosCalculation from '../../../utils/pos_calculation'
import workflow from '../../../images/workflow2.jpg'
import {
  Container as ContainerUI,
  Grid,
  Typography,
  makeStyles,
  Box,
  InputBase
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  h5: {
    fontWeight: 500
  },
  bgImage: {
    width: 1000,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: -1
  },
  sectionsContainer: {
    borderRadius: 10,
    background: theme.palette.purple.main,
    margin: theme.spacing(1)
  },
  input: {
    border: 'none',
    padding: theme.spacing(1),
    fontWeight: 700,
    outline: 'none',
    display: 'block',
  },
  addSectionWrapper: {
    background: theme.palette.blue.main,
    borderRadius: 10,
    padding: theme.spacing(1)
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

  const [addSectionInputText, setAddSectionInputText] = useState('')
  const [sections, setSections] = useState([])

  // QUERIES
  const { data } = useQuery(GET_SECTIONS_BY_PROJECT_ID, {
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
      setAddSectionInputText('')
    }
  }

  return (
    <>
      <ProjectNav />
      <ContainerUI className={classes.root}>
        <img src={workflow} alt="workflow" className={classes.bgImage} />
        <Grid container spacing={2} justify='space-between'>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.h5}>{projectTitle}</Typography>
          </Grid>
          <Grid item xs={12} className={classes.sectionsContainer}>
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
                sections.map((section, index) => <CardContainer key={index} section={section} sections={sections} projectId={projectId} />)
              }
            </Container>
          </Grid>
          <Grid item>
            <Box className={classes.addSectionWrapper}>
              <form onSubmit={onAddSectionSubmit}>
                <InputBase
                  className={classes.input}
                  placeholder='Add a section'
                  onChange={e => setAddSectionInputText(e.target.value)}
                  value={addSectionInputText}
                />
              </form>
            </Box>
          </Grid>
        </Grid>
      </ContainerUI>
    </>
  )
}

