import React from 'react'
import ReactDOM from 'react-dom/client'
import * as firebase from './utils/firebase.js'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </HashRouter>,
)
