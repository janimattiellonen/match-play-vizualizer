import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { MatchData } from '../types/match'
import { fetchMatchFromMetrix } from '../api/metrixClient'
import { downloadResultsImage } from '../utils/downloadResults'
import { getClinchHoleIndex } from '../utils/matchUtils'
import PlayerCard from './PlayerCard'

function computeMatchScores(match: MatchData): [number, number] {
  const clinchIndex = getClinchHoleIndex(match)
  const stopAt = clinchIndex !== null ? clinchIndex + 1 : match.holes.length
  let s1 = 0
  let s2 = 0
  for (let i = 0; i < stopAt; i++) {
    if (match.holes[i].scores[0] < match.holes[i].scores[1]) s1++
    else if (match.holes[i].scores[1] < match.holes[i].scores[0]) s2++
  }
  return [s1, s2]
}

export default function SharedResultsView() {
  const { competitionId } = useParams<{ competitionId: string }>()
  const navigate = useNavigate()
  const [matchData, setMatchData] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!competitionId || !/^\d+$/.test(competitionId)) {
      setError('Invalid competition ID')
      setLoading(false)
      return
    }

    fetchMatchFromMetrix(Number(competitionId))
      .then(setMatchData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load match'))
      .finally(() => setLoading(false))
  }, [competitionId])

  const matchScores = useMemo(() => matchData ? computeMatchScores(matchData) : [0, 0] as [number, number], [matchData])

  const handleDownload = useCallback(() => {
    if (matchData) downloadResultsImage(matchData, matchScores)
  }, [matchData, matchScores])

  if (loading) {
    return (
      <div className="app">
        <div className="scanline" />
        <div className="app-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'var(--font-retro)',
              fontSize: '14px',
              color: 'var(--color-cyan)',
              textShadow: '0 0 10px var(--color-cyan)',
            }}
          >
            LOADING...
          </motion.div>
        </div>
      </div>
    )
  }

  if (error || !matchData) {
    return (
      <div className="app">
        <div className="scanline" />
        <div className="app-content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              gap: '24px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '12px',
                color: 'var(--color-red)',
                textShadow: '0 0 10px var(--color-red)',
              }}
            >
              {error ?? 'Match not found'}
            </span>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '10px',
                padding: '10px 24px',
                background: 'rgba(176, 38, 255, 0.2)',
                color: 'var(--color-purple)',
                border: '2px solid var(--color-purple)',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: '0 0 8px var(--color-purple)',
              }}
            >
              GO HOME
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  const clinchIndex = getClinchHoleIndex(matchData)
  const winnerIndex = matchScores[0] > matchScores[1] ? 0 : matchScores[1] > matchScores[0] ? 1 : null

  return (
    <div className="app">
      <div className="scanline" />
      <div className="app-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            width: '100%',
            padding: '20px',
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
              <PlayerCard player={matchData.players[0]} side="left" highlight={winnerIndex === 0} />
              <div
                style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '56px',
                  fontWeight: 900,
                  color: 'var(--color-cyan)',
                  textShadow: '0 0 10px var(--color-cyan), 0 0 20px var(--color-cyan), 0 0 40px var(--color-cyan)',
                  textAlign: 'center',
                  lineHeight: '80px',
                }}
              >
                {matchScores[0]}
              </div>
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
              <PlayerCard player={matchData.players[1]} side="right" highlight={winnerIndex === 1} />
              <div
                style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '56px',
                  fontWeight: 900,
                  color: 'var(--color-pink)',
                  textShadow: '0 0 10px var(--color-pink), 0 0 20px var(--color-pink), 0 0 40px var(--color-pink)',
                  textAlign: 'center',
                  lineHeight: '80px',
                }}
              >
                {matchScores[1]}
              </div>
            </div>
          </div>

          {/* Score table */}
          <div style={{ overflowX: 'auto', maxWidth: '100%', position: 'relative' }}>
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
                  {matchData.holes.map((_, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '8px 10px',
                        fontFamily: 'var(--font-tech)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-purple)',
                        textAlign: 'center',
                        border: '1px solid rgba(176, 38, 255, 0.15)',
                        borderRight: clinchIndex !== null && i === clinchIndex ? '2px solid rgba(255, 7, 58, 0.6)' : undefined,
                      }}
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: '8px 10px',
                      fontFamily: 'var(--font-retro)',
                      fontSize: '9px',
                      color: 'var(--color-yellow)',
                      textAlign: 'center',
                      border: '1px solid rgba(176, 38, 255, 0.15)',
                      borderLeft: '2px solid rgba(176, 38, 255, 0.3)',
                    }}
                  >
                    +/-
                  </th>
                  <th
                    style={{
                      padding: '8px 10px',
                      fontFamily: 'var(--font-retro)',
                      fontSize: '9px',
                      color: 'var(--color-yellow)',
                      textAlign: 'center',
                      border: '1px solid rgba(176, 38, 255, 0.15)',
                    }}
                  >
                    SUM
                  </th>
                </tr>
              </thead>
              <tbody>
                {[0, 1].map(playerIndex => {
                  let sum = 0
                  let diff = 0
                  return (
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
                        {matchData.players[playerIndex].name}
                      </td>
                      {matchData.holes.map((hole, holeIndex) => {
                        const score = hole.scores[playerIndex]
                        const otherScore = hole.scores[1 - playerIndex]
                        sum += score
                        diff += score - hole.par
                        const isWinner = score < otherScore
                        const isLoser = score > otherScore

                        return (
                          <td
                            key={holeIndex}
                            style={{
                              padding: '8px 10px',
                              fontFamily: 'var(--font-tech)',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: isWinner ? 'var(--color-cyan)' : isLoser ? 'var(--color-red)' : 'var(--color-white)',
                              textAlign: 'center',
                              border: '1px solid rgba(176, 38, 255, 0.15)',
                              borderRight: clinchIndex !== null && holeIndex === clinchIndex ? '2px solid rgba(255, 7, 58, 0.6)' : undefined,
                              background: isWinner
                                ? 'rgba(0, 240, 255, 0.08)'
                                : isLoser
                                  ? 'rgba(255, 7, 58, 0.12)'
                                  : 'transparent',
                            }}
                          >
                            {score}
                          </td>
                        )
                      })}
                      {(() => {
                        const diffColor = diff < 0
                          ? 'var(--color-cyan)'
                          : diff > 0
                            ? 'var(--color-red)'
                            : 'var(--color-white)'
                        const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '0'
                        return (
                          <td
                            style={{
                              padding: '8px 10px',
                              fontFamily: 'var(--font-tech)',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: diffColor,
                              textAlign: 'center',
                              border: '1px solid rgba(176, 38, 255, 0.15)',
                              borderLeft: '2px solid rgba(176, 38, 255, 0.3)',
                            }}
                          >
                            {diffStr}
                          </td>
                        )
                      })()}
                      <td
                        style={{
                          padding: '8px 10px',
                          fontFamily: 'var(--font-tech)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: playerIndex === 0 ? 'var(--color-cyan)' : 'var(--color-pink)',
                          textAlign: 'center',
                          border: '1px solid rgba(176, 38, 255, 0.15)',
                          textShadow: playerIndex === 0
                            ? '0 0 5px var(--color-cyan)'
                            : '0 0 5px var(--color-pink)',
                        }}
                      >
                        {sum}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {clinchIndex !== null && (
                <tfoot>
                  <tr>
                    <td colSpan={clinchIndex + 2} />
                    <td
                      colSpan={matchData.holes.length - clinchIndex + 1}
                      style={{
                        padding: '4px 0 0 0',
                        textAlign: 'left',
                        fontSize: '14px',
                        border: 'none',
                      }}
                    >
                      &#x1F480;
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 15px var(--color-purple), 0 0 30px var(--color-purple)',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '10px',
                padding: '12px 24px',
                background: 'rgba(176, 38, 255, 0.2)',
                color: 'var(--color-purple)',
                border: '2px solid var(--color-purple)',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: '0 0 8px var(--color-purple)',
              }}
            >
              HOME
            </motion.button>

            <motion.button
              onClick={handleDownload}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 15px var(--color-cyan), 0 0 30px var(--color-cyan)',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '10px',
                padding: '12px 24px',
                background: 'rgba(0, 240, 255, 0.15)',
                color: 'var(--color-cyan)',
                border: '2px solid var(--color-cyan)',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: '0 0 8px var(--color-cyan)',
              }}
            >
              DOWNLOAD RESULTS
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
