import { useState, useCallback } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase, MatchData } from './types/match'
import { fetchMatchFromMetrix } from './api/metrixClient'
import VSScreen from './components/VSScreen'
import CountdownOverlay from './components/CountdownOverlay'
import ScoreTable from './components/ScoreTable'
import WinnerCelebration from './components/WinnerCelebration'
import CreateMatchForm from './components/CreateMatchForm'
import { useMatchPlayback } from './hooks/useMatchPlayback'
import './App.css'

const DEFAULT_COMPETITION_ID = 3541752

const PLACEHOLDER_MATCH: MatchData = {
  players: [
    { id: 1, name: 'Player 1', image: '/players/player-1.png' },
    { id: 2, name: 'Player 2', image: '/players/player-2.png' },
  ],
  holes: [],
}

function App() {
  const [matchData, setMatchData] = useState<MatchData | null>(null)
  const [phase, setPhase] = useState<Phase>('vs-screen')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const playback = useMatchPlayback(matchData, phase === 'score-reveal')

  const handleBegin = useCallback(async () => {
    setCreateLoading(true)
    setCreateError(null)
    try {
      const data = await fetchMatchFromMetrix(DEFAULT_COMPETITION_ID)
      data.players[0].image = '/players/player-1.jpeg'
      data.players[1].image = '/players/player-2.jpeg'
      setMatchData(data)
      playback.reset()
      setPhase('countdown')
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to load match')
    } finally {
      setCreateLoading(false)
    }
  }, [playback])

  const handleCreate = () => {
    setCreateError(null)
    setPhase('create-form')
  }

  const handleCreateSubmit = useCallback(async (competitionId: number) => {
    setCreateLoading(true)
    setCreateError(null)
    try {
      const data = await fetchMatchFromMetrix(competitionId)
      setMatchData(data)
      playback.reset()
      setPhase('countdown')
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to load match')
    } finally {
      setCreateLoading(false)
    }
  }, [playback])

  const handleCreateCancel = () => {
    setCreateError(null)
    setPhase('vs-screen')
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

  const displayMatch = matchData ?? PLACEHOLDER_MATCH

  return (
    <div className="app">
      <div className="scanline" />
      <div className="app-content">
        <LayoutGroup>
          <AnimatePresence mode="sync">
            {phase === 'vs-screen' && (
              <VSScreen
                key="vs"
                match={displayMatch}
                matchScores={[0, 0]}
                onBegin={handleBegin}
                onCreate={handleCreate}
                isLoading={createLoading}
                error={createError}
              />
            )}

            {phase === 'create-form' && (
              <CreateMatchForm
                key="create"
                onSubmit={handleCreateSubmit}
                onCancel={handleCreateCancel}
                isLoading={createLoading}
                error={createError}
              />
            )}

            {phase === 'countdown' && (
              <CountdownOverlay key="countdown" onComplete={handleCountdownComplete} />
            )}

            {phase === 'score-reveal' && matchData && (
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

            {phase === 'celebration' && matchData && (
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
