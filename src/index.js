import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import './index.css'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
