import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Production HTML already contains the same portfolio. Attach its interactions;
// the Vite development page starts with an empty root.
if (root.children.length) hydrateRoot(root, app)
else createRoot(root).render(app)
