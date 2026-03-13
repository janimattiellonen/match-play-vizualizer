import { motion } from 'framer-motion'
import type { Player } from '../types/match'

interface PlayerCardProps {
  player: Player
  side: 'left' | 'right'
  highlight?: boolean
  layoutId?: string
}

export default function PlayerCard({ player, side, highlight, layoutId }: PlayerCardProps) {
  const glowColor = side === 'left' ? 'var(--color-cyan)' : 'var(--color-pink)'

  return (
    <motion.div
      className="player-card"
      initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: highlight ? 1.05 : 1,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <motion.div
        layoutId={layoutId}
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `3px solid ${glowColor}`,
          boxShadow: highlight
            ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`
            : `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
        }}
        animate={highlight ? {
          boxShadow: [
            `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
            `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
            `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
          ],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <img
          src={player.image}
          alt={player.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </motion.div>
      <motion.span
        style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '14px',
          color: glowColor,
          textShadow: `0 0 10px ${glowColor}`,
          letterSpacing: '2px',
        }}
      >
        {player.name}
      </motion.span>
    </motion.div>
  )
}
