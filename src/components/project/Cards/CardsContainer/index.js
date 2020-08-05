import React, { useEffect, useState } from 'react'
import Card from '../Card'
import { Container, Draggable } from 'react-smooth-dnd'
import { IoIosAdd } from 'react-icons/io'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PosCalculation from '../../../../utils/pos_calculation'
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
      pos
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

const CardContainer = ({ item, sections }) => {
  const [cards, setCards] = useState([])
  const [isTempCardActive, setTempCardActive] = useState(false)
  const [cardText, setCardText] = useState('')

  // MUTATIONS
  const [insertCard, { data }] = useMutation(ADD_CARD)
  const [updateCardPos] = useMutation(UPDATE_CARD_POS)

  // SUBSCRIPTIONS
  const { data: { cardAdded } = {} } = useSubscription(CARD_ADDED)
  const { data: { onCardPosChange } = {} } = useSubscription(ON_CARD_POS_CHANGE)

  useEffect(() => {
    if (item && item.cards) {
      setCards(item.cards)
    }
  }, [item])

  useEffect(() => {
    if (cardAdded) {
      if (item.id === cardAdded.sectionId) {
        setCards(item.cards.concat(cardAdded))

        setTempCardActive(false)
      }
    }
  }, [cardAdded])

  useEffect(() => {
    if (onCardPosChange) {
      let newCards = cards

      newCards = newCards.map(card => {
        if (card.id === onCardPosChange.id) {
          console.log('current card pos', card.pos)
          console.log('updated card pos', onCardPosChange.pos)
          return { ...card, pos: card.pos }
        } else {
          return card
        }
      })

      //console.log('new cards', newCards)

      let sortedCards = sortBy(newCards, [
        (card) => card.pos
      ])

      setCards(sortedCards)
    }
  }, [onCardPosChange])

  const onCardDrop = (columnId, addedIndex, removedIndex, payload) => {
    let updatedPOS

    if (addedIndex !== null && removedIndex !== null) {
      let sectionCards = sections.filter((p) => p.id === columnId)[0]

      updatedPOS = PosCalculation(removedIndex, addedIndex, sectionCards.cards)

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            pos: updatedPOS,
          }
        } else {
          return item
        }
      })

      let sortedCards = sortBy(newCards, (item) => item.pos)

      console.log('updated POS', updatedPOS)

      updateCardPos({
        variables: {
          cardId: payload.id,
          pos: parseInt(updatedPOS),
          sectionId: columnId,
        }
      })

      setCards(sortedCards)

    } else if (addedIndex !== null) {
      const newColumn = sections.filter((p) => p.id === columnId)[0]
      if (addedIndex === 0) {
        updatedPOS = newColumn.cards[0].pos / 2
      } else if (addedIndex === newColumn.cards.length) {
        updatedPOS = newColumn.cards[newColumn.cards.length - 1].pos + 16384
      } else {
        let afterCardPOS = newColumn.cards[addedIndex].pos
        let beforeCardPOS = newColumn.cards[addedIndex - 1].pos

        updatedPOS = (afterCardPOS + beforeCardPOS) / 2
      }

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            pos: updatedPOS,
          }
        } else {
          return item
        }
      })

      let sortedCards = sortBy(newCards, (item) => item.pos)

      updateCardPos({
        variables: {
          cardId: payload.id,
          pos: parseInt(updatedPOS),
          sectionId: columnId,
        },
      })
      setCards(sortedCards)
    }
  }

  const onAddButtonClick = () => {
    setTempCardActive(true)
  }

  const onAddCardSubmit = (e) => {
    e.preventDefault()
    if (cardText) {
      insertCard({
        variables: {
          sectionId: item.id,
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
    <Draggable key={item.id}>
      <Wrapper className={'card-container'}>
        <WrappedSection>
          <CardContainerHeader className={'column-drag-handle'}>
            <ContainerContainerTitle>{item.title}</ContainerContainerTitle>
          </CardContainerHeader>
          <CardsContainer>
            <Container
              orientation={'vertical'}
              groupName="col"
              // onDragStart={(e) => console.log("Drag Started")}
              // onDragEnd={(e) => console.log("drag end", e)}
              onDrop={(e) => {
                onCardDrop(item.id, e.addedIndex, e.removedIndex, e.payload)
              }}
              dragClass="card-ghost"
              dropClass="card-ghost-drop"
              // onDragEnter={() => {
              // }}
              getChildPayload={(index) => {
                return cards[index]
              }}
              // onDragLeave={() => {
              // }}
              // onDropReady={(p) => console.log("Drop ready: ", p)}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'drop-preview',
              }}
              dropPlaceholderAnimationDuration={200}
            >
              {cards.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </Container>
            {isTempCardActive ? (
              <CardComposerDiv>
                <ListCardComponent>
                  <ListCardDetails>
                    <ListCardTextArea
                      placeholder="Enter a title for the card"
                      onChange={(e) => {
                        setCardText(e.target.value)
                      }}
                    />
                  </ListCardDetails>
                </ListCardComponent>
                <SubmitCardButtonDiv>
                  <SubmitCardButton
                    type="button"
                    value="Add Card"
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

export default CardContainer
