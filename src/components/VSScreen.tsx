import { motion } from 'framer-motion'
import type { MatchData } from '../types/match'
import PlayerCard from './PlayerCard'
import ScoreDisplay from './ScoreDisplay'
import BeginButton from './BeginButton'

interface VSScreenProps {
  match: MatchData
  matchScores: [number, number]
  onBegin: () => void
  onCreate: () => void
  isLoading?: boolean
  error?: string | null
}

export default function VSScreen({ match, matchScores, onBegin, onCreate, isLoading, error }: VSScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          width: '100%',
        }}
      >
        {/* Player 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <PlayerCard player={match.players[0]} side="left" />
          <ScoreDisplay score={matchScores[0]} color="var(--color-cyan)" />
        </div>

        {/* VS */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '36px',
            color: 'var(--color-yellow)',
            textShadow: 'var(--text-glow-yellow)',
            animation: 'textGlow 2s ease-in-out infinite',
          }}
        >
          VS
        </motion.div>

        {/* Player 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <PlayerCard player={match.players[1]} side="right" />
          <ScoreDisplay score={matchScores[1]} color="var(--color-pink)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <BeginButton onClick={onBegin} label={isLoading ? 'LOADING...' : 'ANTTI vs ESKO'} disabled={isLoading} />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '8px',
              color: 'var(--color-red)',
              textShadow: '0 0 5px var(--color-red)',
              textAlign: 'center',
              lineHeight: '1.6',
            }}
          >
            {error}
          </motion.p>
        )}
        <motion.button
          onClick={onCreate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 15px var(--color-cyan), 0 0 30px var(--color-cyan)',
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '12px',
            padding: '12px 32px',
            background: 'rgba(0, 240, 255, 0.15)',
            color: 'var(--color-cyan)',
            border: '2px solid var(--color-cyan)',
            borderRadius: '4px',
            cursor: 'pointer',
            letterSpacing: '3px',
            boxShadow: '0 0 8px var(--color-cyan)',
          }}
        >
          CREATE
        </motion.button>
      </div>
    </motion.div>
  )
}
