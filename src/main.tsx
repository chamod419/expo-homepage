import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startThemeSync } from './hooks/useTheme'

const stopThemeSync = startThemeSync()
if (import.meta.hot) import.meta.hot.dispose(stopThemeSync)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
