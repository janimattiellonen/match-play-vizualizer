import { useState, useEffect } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase, MatchData } from './types/match'
import { fetchMatchFromMetrix } from './api/metrixClient'
import VSScreen from './components/VSScreen'
import CountdownOverlay from './components/CountdownOverlay'
import ScoreTable from './components/ScoreTable'
import WinnerCelebration from './components/WinnerCelebration'
import { useMatchPlayback } from './hooks/useMatchPlayback'
import './App.css'

const COMPETITION_ID = 3541752

function App() {
  const [matchData, setMatchData] = useState<MatchData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('vs-screen')
  const playback = useMatchPlayback(matchData, phase === 'score-reveal')

  useEffect(() => {
    fetchMatchFromMetrix(COMPETITION_ID)
      .then(setMatchData)
      .catch((err) => setError(err.message))
  }, [])

  const handleBegin = () => {
    setPhase('countdown')
  }

  const handleCountdownComplete = () => {
    setPhase('score-reveal')
  }

  const handleRevealComplete = () => {
    setPhase('celebration')
  }

  const handleBack = () => {
    setPhase('vs-screen')
    playback.reset()
  }

  if (error) {
    return (
      <div className="app">
        <div className="app-content">
          <p style={{ color: 'var(--color-red)', fontFamily: 'var(--font-retro)', fontSize: '12px' }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="app">
        <div className="scanline" />
        <div className="app-content">
          <p style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '14px',
            color: 'var(--color-cyan)',
            textShadow: 'var(--text-glow-cyan)',
            animation: 'neonPulse 1.5s ease-in-out infinite',
          }}>
            LOADING...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="scanline" />
      <div className="app-content">
        <LayoutGroup>
          <AnimatePresence mode="sync">
            {phase === 'vs-screen' && (
              <VSScreen
                key="vs"
                match={matchData}
                matchScores={[0, 0]}
                onBegin={handleBegin}
              />
            )}

            {phase === 'countdown' && (
              <CountdownOverlay key="countdown" onComplete={handleCountdownComplete} />
            )}

            {phase === 'score-reveal' && (
              <ScoreTable
                key="score"
                match={matchData}
                revealedHole={playback.revealedHole}
                revealStage={playback.revealStage}
                matchScores={playback.matchScores}
                onComplete={handleRevealComplete}
                isComplete={playback.isComplete}
              />
            )}

            {phase === 'celebration' && (
              <WinnerCelebration
                key="celebration"
                match={matchData}
                matchScores={playback.matchScores}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}

export default App
