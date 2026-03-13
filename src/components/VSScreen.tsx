import { motion } from 'framer-motion'
import type { MatchData } from '../types/match'
import PlayerCard from './PlayerCard'
import ScoreDisplay from './ScoreDisplay'
import BeginButton from './BeginButton'

interface VSScreenProps {
  match: MatchData
  matchScores: [number, number]
  onBegin: () => void
}

export default function VSScreen({ match, matchScores, onBegin }: VSScreenProps) {
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

      <BeginButton onClick={onBegin} />
    </motion.div>
  )
}
