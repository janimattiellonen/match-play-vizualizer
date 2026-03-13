import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import type { Phase, MatchData } from './types/match'
import { fetchMatchFromMetrix } from './api/metrixClient'
import VSScreen from './components/VSScreen'
import CountdownOverlay from './components/CountdownOverlay'
import ScoreTable from './components/ScoreTable'
import WinnerCelebration from './components/WinnerCelebration'
import CreateMatchForm from './components/CreateMatchForm'
import MuteButton from './components/MuteButton'
import AudioVisualizer from './components/AudioVisualizer'
import { useMatchPlayback } from './hooks/useMatchPlayback'
import './App.css'

const DEFAULT_COMPETITION_ID = 3541752

const MUSIC_TRACKS = ['/file.mp3', '/file2.mp3', '/file3.mp3', '/file4.mp3', '/file5.mp3']
const randomTrack = MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)]

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
  const [muted, setMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playback = useMatchPlayback(matchData, phase === 'score-reveal')

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.volume = 1
      audio.play().catch(() => {})
      audio.muted = false
      setMuted(false)
    } else {
      audio.muted = true
      setMuted(true)
    }
  }, [muted])

  // Fade out the last 3 seconds before the track ends, then restart at full volume
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const FADE_DURATION = 3

    function handleTimeUpdate() {
      if (!audio || audio.muted) return
      const remaining = audio.duration - audio.currentTime
      if (remaining <= FADE_DURATION) {
        audio.volume = Math.max(0, remaining / FADE_DURATION)
      } else if (audio.volume < 1) {
        audio.volume = 1
      }
    }

    function handleSeeked() {
      if (!audio || audio.muted) return
      audio.volume = 1
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('seeked', handleSeeked)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('seeked', handleSeeked)
    }
  }, [])

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
      <audio ref={audioRef} src={randomTrack} loop muted />
      <div className="scanline" />
      <AudioVisualizer audioElement={audioRef.current} muted={muted} />
      <MuteButton muted={muted} onToggle={toggleMute} />
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
                onSkip={playback.skip}
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
