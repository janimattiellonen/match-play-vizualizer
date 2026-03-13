import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { MatchData } from '../types/match'
import type { RevealStage } from '../hooks/useMatchPlayback'
import ScoreCell from './ScoreCell'
import ScoreDisplay from './ScoreDisplay'
import PlayerCard from './PlayerCard'

interface ScoreTableProps {
  match: MatchData
  revealedHole: number
  revealStage: RevealStage
  matchScores: [number, number]
  onComplete: () => void
  isComplete: boolean
}

export default function ScoreTable({
  match,
  revealedHole,
  revealStage,
  matchScores,
  onComplete,
  isComplete,
}: ScoreTableProps) {
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, onComplete])

  function getCellValue(holeIndex: number, playerIndex: number): number | null {
    const holeNum = holeIndex + 1
    if (holeNum > revealedHole) return null
    if (holeNum === revealedHole) {
      if (playerIndex === 0 && (revealStage === 'highlight' || revealStage === 'idle')) return null
      if (playerIndex === 1 && (revealStage === 'highlight' || revealStage === 'idle' || revealStage === 'p1-score')) return null
    }
    return match.holes[holeIndex].scores[playerIndex]
  }

  function isRevealing(holeIndex: number, playerIndex: number): boolean {
    const holeNum = holeIndex + 1
    if (holeNum !== revealedHole) return false
    if (playerIndex === 0 && revealStage === 'p1-score') return true
    if (playerIndex === 1 && revealStage === 'p2-score') return true
    return false
  }

  function getHoleResult(holeIndex: number): { loser: number; winner: number } | null {
    const holeNum = holeIndex + 1
    if (holeNum > revealedHole) return null
    if (holeNum === revealedHole && revealStage !== 'result' && revealStage !== 'done') return null
    const [s1, s2] = match.holes[holeIndex].scores
    if (s1 < s2) return { winner: 0, loser: 1 }
    if (s2 < s1) return { winner: 1, loser: 0 }
    return null
  }

  const currentWinner = revealedHole > 0 && (revealStage === 'result' || revealStage === 'done')
    ? getHoleResult(revealedHole - 1)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        padding: '20px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* Player info + scores header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <PlayerCard
            player={match.players[0]}
            side="left"
            highlight={currentWinner?.winner === 0}
            layoutId="player-0-img"
          />
          <ScoreDisplay score={matchScores[0]} color="var(--color-cyan)" />
        </div>

        <motion.div
          style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '24px',
            color: 'var(--color-yellow)',
            textShadow: 'var(--text-glow-yellow)',
          }}
        >
          VS
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <PlayerCard
            player={match.players[1]}
            side="right"
            highlight={currentWinner?.winner === 1}
            layoutId="player-1-img"
          />
          <ScoreDisplay score={matchScores[1]} color="var(--color-pink)" />
        </div>
      </div>

      {/* Score table */}
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            background: 'rgba(10, 10, 26, 0.85)',
            borderRadius: '8px',
            border: '1px solid rgba(176, 38, 255, 0.3)',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '8px 12px',
                  fontFamily: 'var(--font-retro)',
                  fontSize: '9px',
                  color: 'var(--color-purple)',
                  textAlign: 'left',
                  border: '1px solid rgba(176, 38, 255, 0.15)',
                }}
              >
                HOLE
              </th>
              {match.holes.map((_, i) => (
                <th
                  key={i}
                  style={{
                    padding: '8px 10px',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color:
                      i + 1 === revealedHole
                        ? 'var(--color-yellow)'
                        : 'var(--color-purple)',
                    textAlign: 'center',
                    border: '1px solid rgba(176, 38, 255, 0.15)',
                    background:
                      i + 1 === revealedHole
                        ? 'rgba(255, 215, 0, 0.1)'
                        : 'transparent',
                  }}
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1].map(playerIndex => (
              <tr key={playerIndex}>
                <td
                  style={{
                    padding: '8px 12px',
                    fontFamily: 'var(--font-retro)',
                    fontSize: '8px',
                    color: playerIndex === 0 ? 'var(--color-cyan)' : 'var(--color-pink)',
                    textShadow: playerIndex === 0
                      ? '0 0 5px var(--color-cyan)'
                      : '0 0 5px var(--color-pink)',
                    border: '1px solid rgba(176, 38, 255, 0.15)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {match.players[playerIndex].name}
                </td>
                {match.holes.map((_, holeIndex) => {
                  const result = getHoleResult(holeIndex)
                  return (
                    <ScoreCell
                      key={holeIndex}
                      value={getCellValue(holeIndex, playerIndex)}
                      isRevealing={isRevealing(holeIndex, playerIndex)}
                      isLoser={result?.loser === playerIndex}
                      isWinner={result?.winner === playerIndex}
                      isCurrentHole={holeIndex + 1 === revealedHole}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
