export default [
  {
    id: '1',
    title: 'Project 1',
    lists: [
      {
        id: '1',
        header: 'Todo',
        cardIds: ['a', 'b', 'e']
      },
      {
        id: '2',
        header: 'In-progress',
        cardIds: ['b', 'c', 'd']
      },
      {
        id: '3',
        header: 'Done',
        cardIds: ['a', 'b', 'c', 'd', 'e']
      }
    ],
    allCards: {
      'a': {
        id: 'a', title: 'buy milk', content: 'avoid Whole Foods'
      },
      'b': {
        id: 'b', title: 'learn spanish', content: 'look up courses'
      },
      'c': {
        id: 'c', title: 'tidy up room', content: ''
      },
      'd': {
        id: 'd', title: 'call grandma', content: ''
      },
      'e': {
        id: 'e', title: 'try out new recipe', content: 'eg Shakshuka'
      }
    }
  },
  {
    id: '2',
    title: 'Project 2',
    lists: [
      {
        id: '1',
        header: 'Todo',
        cardIds: ['a', 'b', 'e']
      },
      {
        id: '2',
        header: 'In-progress',
        cardIds: ['b', 'c', 'd']
      },
      {
        id: '3',
        header: 'Done',
        cardIds: ['a', 'b', 'c', 'd', 'e']
      }
    ],
    allCards: {
      'a': {
        id: 'a', title: 'buy eggs', content: 'avoid Whole Foods'
      },
      'b': {
        id: 'b', title: 'learn mandarin', content: 'look up courses'
      },
      'c': {
        id: 'c', title: 'tidy up kitchen', content: ''
      },
      'd': {
        id: 'd', title: 'call mum', content: ''
      },
      'e': {
        id: 'e', title: 'try out new recipe', content: 'eg Lentil Soup'
      }
    }
  }
]