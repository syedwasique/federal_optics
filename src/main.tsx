import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Tell the brand loader (inline in index.html) that the first screen has rendered.
declare global {
  interface Window {
    __foAppReady?: () => void;
    __foLoading?: boolean;
  }
}
requestAnimationFrame(() => requestAnimationFrame(() => window.__foAppReady?.()))
