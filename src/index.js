import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './styles/global.scss'
import { HashRouter } from 'react-router-dom'
import { CyclimateProvider } from './hooks/context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <CyclimateProvider>
        <App />
      </CyclimateProvider>
    </HashRouter>
  </React.StrictMode>
)
