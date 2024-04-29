import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './darkMode.scss'
import DarkModeProvider from './context/DarkModeProvider.tsx'
import AuthProvider from './context/AuthProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>,
)
