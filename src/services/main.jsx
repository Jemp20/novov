import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppAdmin from './AppAdmin.jsx'

// Ruta /admin carga el panel, cualquier otra ruta carga la tienda
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AppAdmin /> : <App />}
  </StrictMode>
)
