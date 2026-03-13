import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/theme.css'
import './styles/animations.css'
import App from './App.tsx'
import SharedResultsView from './components/SharedResultsView.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:competitionId" element={<SharedResultsView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
