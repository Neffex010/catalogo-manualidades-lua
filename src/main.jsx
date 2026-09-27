/**
 * main.jsx
 * -----------------------------------------------------------------------------
 * Punto de entrada de la aplicacion React.
 * -----------------------------------------------------------------------------
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('No se encontro el elemento #root en index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
