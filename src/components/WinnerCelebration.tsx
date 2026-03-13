import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { MatchData } from '../types/match'
import { downloadResultsImage } from '../utils/downloadResults'

interface WinnerCelebrationProps {
  match: MatchData
  matchScores: [number, number]
  onBack: () => void
}

type CelebrationStage = 'highlight' | 'fadeout' | 'center' | 'winner-text'

export default function WinnerCelebration({ match, matchScores, onBack }: WinnerCelebrationProps) {
  const navigate = useNavigate()
  const [stage, setStage] = useState<CelebrationStage>('highlight')
  const winnerIndex = matchScores[0] > matchScores[1] ? 0 : 1
  const loserIndex = winnerIndex === 0 ? 1 : 0
  const winner = match.players[winnerIndex]
  const loser = match.players[loserIndex]
  const winnerColor = winnerIndex === 0 ? 'var(--color-cyan)' : 'var(--color-pink)'

  const handleDownload = useCallback(() => {
    downloadResultsImage(match, matchScores)
  }, [match, matchScores])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('fadeout'), 1500),
      setTimeout(() => setStage('center'), 2800),
      setTimeout(() => setStage('winner-text'), 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const showLoser = stage === 'highlight' || stage === 'fadeout'

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '20px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* WINNER text — absolutely positioned above the player row */}
      <AnimatePresence>
        {stage === 'winner-text' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(50% - 250px)',
              fontFamily: 'var(--font-retro)',
              fontSize: '32px',
              color: 'var(--color-yellow)',
              textShadow: 'var(--text-glow-yellow)',
              animation: 'textGlow 1.5s ease-in-out infinite',
              zIndex: 20,
            }}
          >
            WINNER!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Both players row */}
      <motion.div
        animate={{
          gap: showLoser ? '40px' : '0px',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          position: 'relative',
        }}
      >
        {/* Loser side */}
        <motion.div
          animate={{
            opacity: showLoser ? 0.6 : 0,
            scale: stage === 'fadeout' ? 0.85 : showLoser ? 1 : 0.7,
            filter: showLoser
              ? stage === 'fadeout' ? 'grayscale(1) blur(2px)' : 'grayscale(0.5) blur(0px)'
              : 'grayscale(1) blur(4px)',
            width: showLoser ? 'auto' : 0,
            marginRight: showLoser ? undefined : 0,
            marginLeft: showLoser ? undefined : 0,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            order: loserIndex === 0 ? 0 : 2,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <motion.div
            layoutId={`player-${loserIndex}-img`}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <img
              src={loser.image}
              alt={loser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
          <span style={{ fontFamily: 'var(--font-retro)', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            {loser.name}
          </span>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '32px', color: 'rgba(255,255,255,0.4)' }}>
            {matchScores[loserIndex]}
          </span>
        </motion.div>

        {/* VS text — fades out */}
        <motion.div
          animate={{
            opacity: showLoser ? 0.5 : 0,
            width: showLoser ? 'auto' : 0,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '24px',
            color: 'var(--color-yellow)',
            textShadow: 'var(--text-glow-yellow)',
            order: 1,
            overflow: 'hidden',
          }}
        >
          VS
        </motion.div>

        {/* Winner side */}
        <motion.div
          animate={
            stage === 'center' || stage === 'winner-text'
              ? { scale: 1.2 }
              : { scale: 1 }
          }
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10,
            order: winnerIndex === 0 ? 0 : 2,
          }}
        >
          <motion.div
            layoutId={`player-${winnerIndex}-img`}
            animate={
              stage === 'highlight'
                ? {
                    boxShadow: [
                      `0 0 10px ${winnerColor}, 0 0 20px ${winnerColor}`,
                      `0 0 30px ${winnerColor}, 0 0 60px ${winnerColor}, 0 0 80px ${winnerColor}`,
                      `0 0 10px ${winnerColor}, 0 0 20px ${winnerColor}`,
                    ],
                  }
                : {
                    boxShadow: `0 0 30px var(--color-yellow), 0 0 60px var(--color-yellow), 0 0 80px var(--color-yellow)`,
                  }
            }
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              width: stage === 'center' || stage === 'winner-text' ? '220px' : '180px',
              height: stage === 'center' || stage === 'winner-text' ? '220px' : '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: `3px solid ${stage === 'winner-text' ? 'var(--color-yellow)' : winnerColor}`,
              transition: 'width 1s ease-in-out, height 1s ease-in-out, border-color 0.8s ease-in-out',
            }}
          >
            <img
              src={winner.image}
              alt={winner.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>

          <motion.span
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '16px',
              color: stage === 'winner-text' ? 'var(--color-yellow)' : winnerColor,
              textShadow: stage === 'winner-text' ? 'var(--text-glow-yellow)' : `0 0 10px ${winnerColor}`,
              letterSpacing: '3px',
              transition: 'color 0.8s ease-in-out, text-shadow 0.8s ease-in-out',
            }}
          >
            {winner.name}
          </motion.span>

          <motion.span
            initial={{ scale: 1 }}
            animate={stage === 'winner-text' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '48px',
              fontWeight: 900,
              color: 'var(--color-yellow)',
              textShadow: 'var(--text-glow-yellow)',
            }}
          >
            {matchScores[winnerIndex]}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <AnimatePresence>
        {stage === 'winner-text' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '8%',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <motion.button
              onClick={onBack}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 15px var(--color-purple), 0 0 30px var(--color-purple)',
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '12px',
                padding: '12px 32px',
                background: 'rgba(176, 38, 255, 0.2)',
                color: 'var(--color-purple)',
                border: '2px solid var(--color-purple)',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '3px',
                boxShadow: '0 0 8px var(--color-purple)',
              }}
            >
              BACK
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

            {match.metrixUrl && (
              <motion.button
                onClick={() => {
                  const id = match.metrixUrl!.split('/').pop()
                  if (id) navigate(`/${id}`)
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 15px var(--color-yellow), 0 0 30px var(--color-yellow)',
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontFamily: 'var(--font-retro)',
                  fontSize: '10px',
                  padding: '12px 24px',
                  background: 'rgba(255, 215, 0, 0.15)',
                  color: 'var(--color-yellow)',
                  border: '2px solid var(--color-yellow)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  boxShadow: '0 0 8px var(--color-yellow)',
                }}
              >
                SHARE RESULTS
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
