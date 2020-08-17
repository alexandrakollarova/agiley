import React, { useEffect, useState } from 'react'
import Card from '.'
import { Container, Draggable } from 'react-smooth-dnd'
import { IoIosAdd } from 'react-icons/io'
import { useMutation, useSubscription, useQuery, useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PosCalculation from '../../utils/pos_calculation'
import sortBy from 'lodash/sortBy'

import {
  Wrapper,
  WrappedSection,
  CardContainerHeader,
  ContainerContainerTitle,
  CardsContainer,
  AddCardButtonDiv,
  AddCardButtonSpan,
  CardComposerDiv,
  ListCardComponent,
  ListCardDetails,
  ListCardTextArea,
  SubmitCardButtonDiv,
  SubmitCardButton,
  SubmitCardIcon,
} from './index-styles'

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

export default function CardContainer({ section, sections }) {
  const client = useApolloClient()
  const sectionId = section.id

  const [cards, setCards] = useState([])
  const [isTempCardActive, setTempCardActive] = useState(false)
  const [cardText, setCardText] = useState('')

  // QUERIES
  const { loading, error, data } = useQuery(GET_CARDS_BY_SECTION_ID, {
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
        setTempCardActive(false)
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
        { query: GET_SECTIONS }
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

  function onAddButtonClick() {
    setTempCardActive(true)
  }

  function onAddCardSubmit(e) {
    e.preventDefault()
    if (cardText) {
      insertCard({
        variables: {
          sectionId: section.id,
          title: cardText,
          label: cardText,
          pos:
            cards && cards.length > 0
              ? cards[cards.length - 1].pos + 16348
              : 16348,
        },
      })
      setCardText('')
    }
  }

  return (
    <Draggable key={section.id}>
      <Wrapper className={'card-container'}>
        <WrappedSection>
          <CardContainerHeader className={'column-drag-handle'}>
            <ContainerContainerTitle>{section.title}</ContainerContainerTitle>
          </CardContainerHeader>
          <CardsContainer>
            <Container
              orientation={'vertical'}
              groupName='col'
              // onDragStart={e => console.log('drag started')}
              //onDragEnd={e => console.log('DRAG END', e)}
              onDrop={e => onCardDrop(section.id, e.addedIndex, e.removedIndex, e.payload)}
              dragClass='card-ghost'
              dropClass='card-ghost-drop'
              // onDragEnter={e => console.log('on drag enter', e)}
              getChildPayload={index => cards[index]}
              //onDropReady={e => console.log('ON DROP READY', e)}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'drop-preview'
              }}
              dropPlaceholderAnimationDuration={200}
            >
              {cards.map(card => <Card key={card.id} card={card} />)}
            </Container>
            {isTempCardActive ? (
              <CardComposerDiv>
                <ListCardComponent>
                  <ListCardDetails>
                    <ListCardTextArea
                      placeholder='Enter a title for the card'
                      onChange={e => setCardText(e.target.value)}
                    />
                  </ListCardDetails>
                </ListCardComponent>
                <SubmitCardButtonDiv>
                  <SubmitCardButton
                    type='button'
                    value='Add Card'
                    onClick={onAddCardSubmit}
                  />
                  <SubmitCardIcon>
                    <IoIosAdd />
                  </SubmitCardIcon>
                </SubmitCardButtonDiv>
              </CardComposerDiv>
            ) : (
                <AddCardButtonDiv onClick={onAddButtonClick}>
                  <AddCardButtonSpan>Add another card</AddCardButtonSpan>
                </AddCardButtonDiv>
              )}
          </CardsContainer>
        </WrappedSection>
      </Wrapper>
    </Draggable>
  )
}