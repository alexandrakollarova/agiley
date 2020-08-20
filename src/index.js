import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import { ApolloProvider } from '@apollo/react-hooks'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import './index.css'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
