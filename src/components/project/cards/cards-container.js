import React, { useEffect, useState } from 'react'
import Card from '.'
import { Container, Draggable } from 'react-smooth-dnd'
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PosCalculation from '../../../utils/pos_calculation'
import sortBy from 'lodash/sortBy'
import {
  Typography,
  makeStyles,
  Box,
  InputBase
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    display: 'inline-block',
    height: '100%',
    verticalAlign: 'top',
    whiteSpace: 'normal',
    opacity: (props) => (props.isDragging ? 0 : 1)
  },
  sectionWrapper: {
    minWidth: 300,
    background: theme.palette.greyGradient.main,
    borderRadius: 10,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    position: 'relative',
    display: 'inline-flex',
    height: 'auto',
    maxHeight: '90%',
    flexDirection: 'column'
  },
  sectionHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    background: theme.palette.orange.main,
    borderRadius: 10,
    padding: theme.spacing(1),
    cursor: 'grab'
  },
  h6: {
    color: 'white',
    fontWeight: 700
  },
  cardWrapper: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '90vh',
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  addCardWrapper: {
    cursor: 'pointer',
    display: 'block',
    maxWidth: 300,
    minHeight: 20,
    position: 'relative',
    textDecoration: 'none',
    zIndex: 0
  },
  input: {
    border: 'none',
    padding: theme.spacing(1),
    fontWeight: 700,
    outline: 'none',
    display: 'block'
  }
}))

const GET_CARDS_BY_SECTION_ID = gql`
  query getCardsBySectionId($sectionId: ID!) {
    getCardsBySectionId(request: { sectionId: $sectionId}) {
      id
      title
      label
      description
      pos
      sectionId
    }
  }
`

const ADD_CARD = gql`
  mutation InsertCard(
    $sectionId: ID!
    $title: String!
    $label: String!
    $pos: Int!
  ) {
    insertCard(
      request: {
        sectionId: $sectionId
        title: $title
        label: $label
        pos: $pos
      }
    ) {
      title
      label
      id
    }
  }
`

const CARD_ADDED = gql`
  subscription {
    cardAdded {
      id
      title
      description
      sectionId
      pos
    }
  }
`

const UPDATE_CARD_POS = gql`
  mutation UpdateCard($cardId: String!, $pos: Int!, $sectionId: String!) {
    updateCardPos(
      request: { cardId: $cardId, pos: $pos, sectionId: $sectionId }
    ) {
      id
      title
      label
      pos,
      sectionId
    }
  }
`

const ON_CARD_POS_CHANGE = gql`
  subscription {
    onCardPosChange {
      id
      title
      label
      description
      pos
      sectionId
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

export default function CardContainer({
  section,
  sections,
  projectId
}) {
  const classes = useStyles()
  const sectionId = section.id

  const [cards, setCards] = useState([])
  const [addCardInputText, setCardInputText] = useState('')

  // QUERIES
  const { data } = useQuery(GET_CARDS_BY_SECTION_ID, {
    variables: { sectionId }
  })

  // MUTATIONS
  const [insertCard] = useMutation(ADD_CARD)
  const [updateCardPos] = useMutation(UPDATE_CARD_POS)

  // SUBSCRIPTIONS
  const { data: { cardAdded } = {} } = useSubscription(CARD_ADDED)
  const { data: { onCardPosChange } = {} } = useSubscription(ON_CARD_POS_CHANGE)

  useEffect(() => {
    if (data) {
      setCards(data.getCardsBySectionId)
    }
  }, [data])

  useEffect(() => {
    if (cardAdded) {
      if (section.id === cardAdded.sectionId) {
        setCards(cards.concat(cardAdded))
      }
    }
  }, [cardAdded])

  useEffect(() => {
    if (onCardPosChange) {
      let newCards = cards.map(card => {
        if (card.id === onCardPosChange.id) {
          return {
            ...card,
            pos: onCardPosChange.pos,
            sectionId: onCardPosChange.sectionId
          }
        } else {
          return card
        }
      })

      let sortedCards = sortBy(newCards, card => card.pos)
      setCards(sortedCards)
    }
  }, [onCardPosChange])

  function onCardDrop(columnId, addedIndex, removedIndex, payload) {
    let updatedPOS

    if (addedIndex !== null && removedIndex !== null) {
      let section = sections.filter(section => section.id === columnId)[0]

      updatedPOS = PosCalculation(removedIndex, addedIndex, section.cards)

      let newCards = cards.map(card => {
        if (card.id === payload.id) {
          return {
            ...card,
            pos: updatedPOS
          }
        } else {
          return card
        }
      })

      let sortedCards = sortBy(newCards, card => card.pos)
      setCards(sortedCards)

      updateCardPos({
        variables: {
          cardId: payload.id,
          pos: parseInt(updatedPOS),
          sectionId: columnId,
        }
      })
    } else if (addedIndex !== null) {
      const newSection = sections.filter(section => section.id === columnId)[0]

      updatedPOS = PosCalculation(removedIndex, addedIndex, newSection.cards)
      const sectionIds = sections.map(section => section.id)

      const queries = sectionIds.map(id => {
        return { query: GET_CARDS_BY_SECTION_ID, variables: { sectionId: id } }
      })

      queries.push(
        { query: GET_PROJECTS },
        { query: GET_SECTIONS },
        { query: GET_SECTIONS_BY_PROJECT_ID, variables: { projectId } }
      )

      updateCardPos({
        variables: {
          cardId: payload.id,
          pos: parseInt(updatedPOS),
          sectionId: columnId
        },
        refetchQueries: queries
      })
    }
  }

  function onAddCardSubmit(e) {
    e.preventDefault()

    if (addCardInputText) {
      insertCard({
        variables: {
          sectionId: section.id,
          title: addCardInputText,
          label: addCardInputText,
          pos:
            cards && cards.length > 0
              ? cards[cards.length - 1].pos + 16348
              : 16348
        },
        refetchQueries: [{ query: GET_CARDS_BY_SECTION_ID, variables: { sectionId } }]
      })
      setCardInputText('')
    }
  }

  return (
    <Draggable key={section.id}>
      <Box className={['card-container', classes.wrapper]}>
        <Box className={classes.sectionWrapper}>
          <Box className={['column-drag-handle', classes.sectionHeaderWrapper]}>
            <Typography variant='h6' className={classes.h6}>{section.title}</Typography>
          </Box>
          <Box className={classes.cardWrapper}>
            <Container
              orientation={'vertical'}
              groupName='col'
              onDrop={e => onCardDrop(section.id, e.addedIndex, e.removedIndex, e.payload)}
              dragClass='card-ghost'
              dropClass='card-ghost-drop'
              getChildPayload={index => cards[index]}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'drop-preview'
              }}
              dropPlaceholderAnimationDuration={200}
            >
              {cards.map(card => <Card key={card.id} card={card} />)}
            </Container>
            <Box className={classes.addCardWrapper}>
              <form onSubmit={onAddCardSubmit}>
                <InputBase
                  className={classes.input}
                  placeholder='Add a card'
                  onChange={e => setCardInputText(e.target.value)}
                  value={addCardInputText}
                />
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </Draggable>
  )
}